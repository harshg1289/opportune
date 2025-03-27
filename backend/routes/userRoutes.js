// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const adminCheck = require('../middleware/admin');

// @route   GET api/users/:userId/profile
// @desc    Get user profile
// @access  Private
router.get('/:userId/profile', auth, userController.getUserProfile);

// @route   PUT api/users/:userId/profile
// @desc    Update user profile
// @access  Private
router.put('/:userId/profile', [
  auth,
  upload.single('resume')
], userController.updateUserProfile);

router.get('/', auth, adminCheck, userController.getAllUsers);
router.delete('/:userId', auth, adminCheck, userController.deleteUser);

module.exports = router;