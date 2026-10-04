const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * Helper to normalize tags (string array or comma-separated string)
 */
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => t.trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * @desc    Get all blog posts with search, filter, and pagination
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res, next) => {
  try {
    const { search, category, tag, author, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Search filter (searches title, content, or tags)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach comment counts for all fetched posts efficiently
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const commentCountMap = {};
    commentCounts.forEach((item) => {
      commentCountMap[item._id.toString()] = item.count;
    });

    const postsWithCommentCounts = posts.map((post) => ({
      ...post,
      commentCount: commentCountMap[post._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      count: postsWithCommentCounts.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: postsWithCommentCounts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio createdAt')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // Get comments for this post
    const comments = await Comment.find({ post: post._id })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...post,
        comments,
        commentCount: comments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, coverImage, category, tags } = req.body;

    const formattedTags = parseTags(tags);

    const newPost = await Post.create({
      title,
      content,
      coverImage: coverImage || '',
      category: category || 'General',
      tags: formattedTags,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // Strict Authorization check: Ensure logged in user is the post author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to edit this post.',
      });
    }

    const { title, content, coverImage, category, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category) post.category = category;
    if (tags !== undefined) post.tags = parseTags(tags);

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post and its associated comments
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // Strict Authorization check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this post.',
      });
    }

    // Cascade delete comments
    await Comment.deleteMany({ post: post._id });

    // Delete post
    await Post.findByIdAndDelete(post._id);

    return res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts authored by current logged in user (with dashboard stats)
 * @route   GET /api/posts/user/me
 * @access  Private
 */
const getUserDashboardPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const commentCountMap = {};
    let totalCommentsReceived = 0;

    commentCounts.forEach((item) => {
      commentCountMap[item._id.toString()] = item.count;
      totalCommentsReceived += item.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post,
      commentCount: commentCountMap[post._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        posts: postsWithCounts,
        stats: {
          totalPosts: posts.length,
          totalCommentsReceived,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all distinct categories
 * @route   GET /api/posts/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Post.distinct('category');
    const defaultCategories = [
      'Technology',
      'Web Development',
      'AI & Future',
      'Design & UI',
      'Tutorials',
      'Productivity',
      'General',
    ];
    const combined = Array.from(new Set([...defaultCategories, ...categories]));

    return res.status(200).json({
      success: true,
      data: combined,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserDashboardPosts,
  getCategories,
};
