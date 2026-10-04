const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * @desc    Get comments for a specific post
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
    }

    // Strict Authorization check: Only comment author can edit
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to edit this comment.',
      });
    }

    comment.content = content;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully!',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
    }

    // Strict Authorization check: Only comment author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this comment.',
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
};
