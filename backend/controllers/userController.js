// backend/controllers/userController.js
const User = require('../models/User.js');
const fs = require('fs');
const path = require('path');
// const mongoose = require('mongoose');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {

    const userId = req.params.userId;

    // Check authorization - only allow users to see their own profile unless admin
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check authorization - only allow users to update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    const { name, email, phone, skills } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (skills !== undefined) user.skills = skills;

    // Handle resume upload if file exists
    if (req.file) {
      // Delete old resume if exists
      if (user.resumeUrl) {
        const oldPath = path.join(__dirname, '..', user.resumeUrl);
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.error('Error deleting old resume:', err);
        }
      }

      // Set new resume URL
      user.resumeUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};