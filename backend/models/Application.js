// backend/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only apply to a job once
ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);