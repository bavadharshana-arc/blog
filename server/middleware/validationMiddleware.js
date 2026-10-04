const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return formatted 400 error
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: errorList[0]?.message || 'Invalid input data',
      errors: errorList,
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for creating a post
 */
const postValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('coverImage')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
  body('tags')
    .optional()
    .custom((value) => {
      if (value && !Array.isArray(value) && typeof value !== 'string') {
        throw new Error('Tags must be an array or comma-separated string');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for updating an existing post
 */
const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('coverImage')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
  body('tags')
    .optional()
    .custom((value) => {
      if (value && !Array.isArray(value) && typeof value !== 'string') {
        throw new Error('Tags must be an array or comma-separated string');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for adding/updating a comment
 */
const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  postValidation,
  updatePostValidation,
  commentValidation,
};

