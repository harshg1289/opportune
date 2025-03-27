// backend/controllers/applicationController.js
const Application = require('../models/Application.js');
const Job = require('../models/Job.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    // Check if job exists and is active
    const job = await Job.findOne({ _id: jobId, status: 'Active' });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not active' });
    }
    
    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    // Create application
    const newApplication = new Application({
      job: jobId,
      user: req.user.id
    });
    
    const application = await newApplication.save();
    
    // Return populated application
    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('user', 'name email');
    
    res.status(201).json(populatedApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Add ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check authorization - only allow users to see their own applications unless admin
    if (req.user.id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const applications = await Application.find({ user: userId })
      .populate('job')
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('user', 'name email')
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { status } = req.body;
    
    // Validate status value
    if (!['Pending', 'Reviewing', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company')
      .populate('user', 'name email');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = status;
    await application.save();
    
    res.json(application);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentApplicationsForCompany = async (req, res) => {
  try {
    // Ensure user is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Fetch applications for jobs posted by the logged-in company
    const applications = await Application.find()
      .populate({
        path: 'job',
        match: { company: req.user.id },
        select: 'title'
      })
      .populate('user', 'name email')
      .sort({ appliedDate: -1 });

    // Filter out applications without matching jobs
    const filteredApplications = applications.filter(app => app.job);

    res.json(filteredApplications);
  } catch (err) {
    console.error('Error fetching recent applications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
