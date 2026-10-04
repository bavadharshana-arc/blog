const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      minlength: [1, 'Comment must have at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required for comment'],
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required for comment'],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
