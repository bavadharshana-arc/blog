const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
