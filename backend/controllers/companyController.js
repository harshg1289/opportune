// backend/controllers/companyController.js
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Register company
exports.registerCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if company exists
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({ errors: [{ msg: 'Company already exists' }] });
    }

    // Create company
    company = new Company({ name, email, password });
    await company.save();

    // Generate JWT
    const payload = {
      company: {
        id: company.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login company
exports.loginCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if company exists
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Check password
    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Generate JWT
    const payload = {
      company: {
        id: company.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      async (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).send('Server error');
        }

        // Return company data WITHOUT password
        const companyData = await Company.findById(company.id).select('-password');
        res.json({ token, company: companyData }); // ✅ Sanitized response
      }
    );
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get logged-in company profile
exports.getCompany = async (req, res) => {
  try {
    const companyData = await Company.findById(company.id).select('-password');
    res.json({ token, company: companyData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// backend/controllers/companyController.js
exports.getAllCompanies = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const companies = await Company.find().select('-password');
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const company = await Company.findById(req.params.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    await company.remove();
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await jobs.find({ company: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching company jobs:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

