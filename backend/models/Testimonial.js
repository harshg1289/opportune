// backend/models/Testimonial.js
const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/assets/images/default-avatar.jpg'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);