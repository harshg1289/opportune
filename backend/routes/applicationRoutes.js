// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
// const adminCheck = require('../middleware/admin');

// @route   POST api/applications
// @desc    Apply for a job
// @access  Private
router.post('/', auth, applicationController.applyForJob);

// @route   GET api/applications/user/:userId
// @desc    Get user applications
// @access  Private
router.get('/user/:userId', auth, applicationController.getUserApplications);

// @route   GET api/applications
// @desc    Get all applications
// @access  Private/Admin
// router.get('/', auth, adminCheck, applicationController.getAllApplications);
router.get('/', auth, applicationController.getAllApplications);

// @route   PATCH api/applications/:id/status
// @desc    Update application status
// @access  Private/Admin   
router.patch('/:id/status', auth, applicationController.updateApplicationStatus);

router.get('/applications/company', auth, applicationController.getRecentApplicationsForCompany);

module.exports = router;