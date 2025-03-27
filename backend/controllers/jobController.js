// backend/controllers/jobController.js
const Job = require('../models/Job.js');
const Application = require('../models/Application.js');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all jobs with filtering and pagination
exports.getJobs = async (req, res) => {
  try {
    const {
      location,
      jobType,
      salary,
      query,
      category,
      page = 1,
      limit = 20
    } = req.query;

    console.log("Received search params:", { location, jobType, salary, query, category });

    // Build query object
    const queryObj = { status: 'Active' };

    if (location) queryObj.location = location;
    if (jobType) queryObj.type = jobType;
    if (req.query.category) {
      queryObj.category = category;
      console.log("BACKEND: Filtering by category:", req.query.category);
    }

    // Fix text search implementation
    if (query && query.trim() !== '') {
      // Use simple regex search on multiple fields
      const searchRegex = new RegExp(query, 'i');
      queryObj.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex }
      ];
    }

    // Salary filter - parse ranges
    if (salary) {
      const ranges = {
        '0-50000': { min: 0, max: 50000 },
        '50000-100000': { min: 50000, max: 100000 },
        '100000+': { min: 100000, max: Infinity }
      };
      const { min, max } = ranges[salary];
      queryObj.salary = { $gte: min, $lte: max };
    }

    console.log('MongoDB query:', JSON.stringify(queryObj, null, 2));

    // Get total count for pagination
    const total = await Job.countDocuments(queryObj);

    // Get jobs with pagination
    const jobs = await Job.find(queryObj)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log(`Found ${jobs.length} jobs matching criteria out of ${total} total matches`);

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Job search error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get job counts by category for home page
exports.getJobCounts = async (req, res) => {
  try {
    const categories = [
      'Technology', 'Business', 'Design', 'Marketing',
      'Healthcare', 'Education', 'Hospitality', 'Finance',
      'Other'
    ];

    const results = await Promise.all(
      categories.map(async (category) => {
        const count = await Job.countDocuments({
          category,
          status: 'Active'
        });

        return {
          category,
          count
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured jobs for home page
exports.getFeaturedJobs = async (req, res) => {
  try {
    const featuredJobs = await Job.find({
      featured: true,
      status: 'Active'
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(featuredJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// exports.createJob = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     if (!req.user.isAdmin && !req.user.isCompany) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     const {
//       title,
//       location,
//       type,
//       category,
//       salary,
//       description,
//       featured
//     } = req.body;

//     const company = req.user.isCompany ? req.user.id : req.body.company;

//     const newJob = new Job({
//       title,
//       company,
//       location,
//       type,
//       category: category || 'Other',
//       salary,
//       description,
//       status: 'Active',
//       featured: featured || false
//     });

//     const job = await newJob.save();
//     res.status(201).json(job);
//   } catch (err) {
//     console.error('Job creation error:', err.message);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Ensure only companies or admins can post jobs
    if (!req.user.isAdmin && !req.user.isCompany) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, location, type, category, salary, description, featured } = req.body;

    // Automatically associate company ID for company users
    const company = req.user.isCompany ? req.user.id : req.body.company;

    if (!company) {
      return res.status(400).json({ message: 'Company information is required' });
    }

    const newJob = new Job({
      title,
      company,
      location,
      type,
      category: category || 'Other',
      salary,
      description,
      status: 'Active', // Default status
      featured: featured || false
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update job status (admin only)
exports.updateJobStatus = async (req, res) => {
  try {

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;

    // Validate status value
    if (!['Active', 'Paused', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.status = status;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Full job update (admin only)
exports.updateJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update fields
    const {
      title,
      company,
      location,
      type,
      category,
      salary,
      description,
      status,
      featured
    } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (type) job.type = type;
    if (category) job.category = category;
    if (salary) job.salary = salary;
    if (description) job.description = description;
    if (status) job.status = status;
    if (featured !== undefined) job.featured = featured;

    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job (admin only)
exports.deleteJob = async (req, res) => {
  try {

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    // Delete the job
    await job.remove();

    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching company jobs:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update job status (company can only update their own jobs)
exports.updateCompanyJobStatus = async (req, res) => {
  try {
    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    // Check if user is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;

    // Validate status value
    if (!['Active', 'Paused', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ 
      _id: req.params.id,
      company: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    job.status = status;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error('Error updating job status:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job (company can only delete their own jobs)
exports.deleteCompanyJob = async (req, res) => {
  try {
    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    // Check if user is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ 
      _id: req.params.id,
      company: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    // Delete the job
    await job.remove();

    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
