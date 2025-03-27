// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check for company
    if (decoded.company) {
      req.company = await Company.findById(decoded.company.id).select('-password');
      return next();
    }

    // Check for user
    if (decoded.user) {
      req.user = await User.findById(decoded.user.id).select('-password');
      return next();
    }

    if (decoded.userId) {
      req.user = await User.findById(decoded.userId.id).select('-password');
      return next();
    }

    throw new Error('Invalid token');
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
