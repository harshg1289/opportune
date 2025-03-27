// backend/routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial.js');

// @route   GET api/testimonials
// @desc    Get all active testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true });
    res.json(testimonials);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;