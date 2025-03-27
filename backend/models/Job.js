// backend/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  category: {
    type: String,
    enum: [
      'Technology', 'Business', 'Design', 'Marketing',
      'Healthcare', 'Education', 'Hospitality', 'Finance',
      'Other'
    ],
    default: 'Other'
  },
  salary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Closed'],
    default: 'Active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
});

JobSchema.pre('find', function() {
  this.populate('company', 'name');
});

JobSchema.pre('findOne', function() {
  this.populate('company', 'name');
});

// Add text index for search functionality
JobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  location: 'text'
});

module.exports = mongoose.model('Job', JobSchema);