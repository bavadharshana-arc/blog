const express = require('express');
const router = express.Router();
const {
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { commentValidation } = require('../middleware/validationMiddleware');

router.put('/:id', protect, commentValidation, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
