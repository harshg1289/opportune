// backend/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const companyController = require('../controllers/companyController');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/admin');

// @route   POST /api/companies/register
router.post('/register', [
  check('name', 'Company name is required').notEmpty(),
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be 6+ characters').isLength({ min: 6 })
], companyController.registerCompany);

// @route   POST /api/companies/login
router.post('/login', [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').exists()
], companyController.loginCompany);


// backend/routes/companyRoutes.js
router.get('/', auth, adminCheck, companyController.getAllCompanies);
router.delete('/:companyId', auth, adminCheck, companyController.deleteCompany);

// @route   GET /api/companies/me
router.get('/me', auth, companyController.getCompany);

module.exports = router;