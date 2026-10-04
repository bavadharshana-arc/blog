const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserDashboardPosts,
  getCategories,
} = require('../controllers/postController');
const {
  getPostComments,
  addComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const {
  postValidation,
  updatePostValidation,
  commentValidation,
} = require('../middleware/validationMiddleware');

// Post endpoints
router.get('/', getAllPosts);
router.get('/categories', getCategories);
router.get('/user/me', protect, getUserDashboardPosts);
router.get('/:id', getPostById);
router.post('/', protect, postValidation, createPost);
router.put('/:id', protect, updatePostValidation, updatePost);
router.delete('/:id', protect, deletePost);

// Nested comment routes on posts: /api/posts/:postId/comments
router.get('/:postId/comments', getPostComments);
router.post('/:postId/comments', protect, commentValidation, addComment);

module.exports = router;
