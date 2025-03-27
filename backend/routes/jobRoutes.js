// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jobController = require('../controllers/jobController.js');
const auth = require('../middleware/auth.js');

// @route   GET api/jobs
// @desc    Get all jobs with filtering
// @access  Public
router.get('/', jobController.getJobs);

// @route   GET api/jobs/counts
// @desc    Get job counts by category
// @access  Public
router.get('/counts', jobController.getJobCounts);

// @route   GET api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', jobController.getFeaturedJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', jobController.getJobById);



// @route   POST api/jobs
// @desc    Create a job
// @access  Private (Admin or Company)
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    // check('company', 'Company is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('salary', 'Salary is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], jobController.createJob);

// Add a new route for companies to get their own jobs
// @route   GET api/jobs/company
// @desc    Get jobs posted by the logged-in company
// @access  Private/Company
router.get('jobs/company', auth, jobController.getCompanyJobs);

router.post('/company', auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('salary', 'Salary is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty()
], jobController.createJob);

// Add a route for companies to update job status
// @route   PATCH api/jobs/:id/company-status
// @desc    Update job status (company can only update their own jobs)
// @access  Private/Company
router.patch('/:id/company-status', auth, jobController.updateCompanyJobStatus);

// Add a route for companies to delete their jobs
// @route   DELETE api/jobs/:id/company
// @desc    Delete job (company can only delete their own jobs)
// @access  Private/Company
router.delete('/:id/company', auth, jobController.deleteCompanyJob);

// @route   PATCH api/jobs/:id/status
// @desc    Update job status
// @access  Private/Admin
router.patch('/:id/status', auth, jobController.updateJobStatus);

// @route   PUT api/jobs/:id
// @desc    Update job
// @access  Private/Admin
router.put('/:id', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('salary', 'Salary is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], jobController.updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete job
// @access  Private/Admin
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;