// backend/seeds/seed.js
const mongoose = require('mongoose');
const User = require('../models/User.js');
const Company = require('../models/Company.js');
const Job = require('../models/Job.js');
const Testimonial = require('../models/Testimonial.js');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed Admin User
const seedAdmin = async () => {
  try {
    // Clear existing admin
    await User.deleteOne({ email: 'admin@opportune.com' });

    // Create new admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@opportune.com',
      password: 'admin123',
      isAdmin: true
    });

    await admin.save();
    console.log('Admin user seeded successfully');
  } catch (err) {
    console.error('Admin user seed error:', err);
  }
};

// Seed Companies
const seedCompanies = async () => {
  try {
    // Clear existing companies
    await Company.deleteMany({});

    // Sample companies data
    const companiesData = [
      {
        name: 'TechCorp',
        email: 'tech@techcorp.com',
        password: 'techcorp123',
        industry: 'Technology',
        website: 'https://techcorp.com',
        size: '500+'
      },
      {
        name: 'DesignHub',
        email: 'info@designhub.com',
        password: 'designhub123',
        industry: 'Design',
        website: 'https://designhub.com',
        size: '51-200'
      },
      {
        name: 'DataWorks',
        email: 'careers@dataworks.com',
        password: 'dataworks123',
        industry: 'Data Science',
        website: 'https://dataworks.com',
        size: '201-500'
      },
      {
        name: 'GrowthCo',
        email: 'hello@growthco.com',
        password: 'growthco123',
        industry: 'Marketing',
        website: 'https://growthco.com',
        size: '11-50'
      },
      {
        name: 'HealthPlus',
        email: 'contact@healthplus.com',
        password: 'healthplus123',
        industry: 'Healthcare',
        website: 'https://healthplus.com',
        size: '500+'
      }
    ];

    // Insert companies and return created companies
    const companies = await Company.insertMany(companiesData);
    console.log('Companies seeded successfully');

    // Create a map for company name to ID
    const companyMap = companies.reduce((map, company) => {
      map[company.name] = company._id;
      return map;
    }, {});

    return companyMap;
  } catch (err) {
    console.error('Companies seed error:', err);
    throw err;
  }
};

// Modified Seed Jobs to use company references
const seedJobs = async (companyMap) => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});

    // Sample jobs data with company references
    const jobsData = [
      {
        title: 'Senior Frontend Developer',
        company: companyMap['TechCorp'],
        location: 'San Francisco',
        type: 'Full-time',
        category: 'Technology',
        salary: '$110,000 - $140,000',
        description: 'We are looking for a Senior Frontend Developer with 5+ years of experience with React and modern JavaScript. You will be working on our main product.',
        featured: true
      },
      {
        title: 'UX/UI Designer',
        company: companyMap['DesignHub'],
        location: 'Remote',
        type: 'Full-time',
        category: 'Design',
        salary: '$90,000 - $120,000',
        description: 'Join our design team to create beautiful and functional user interfaces for clients across various industries.'
      },
      {
        title: 'Data Scientist',
        company: companyMap['DataWorks'],
        location: 'New York',
        type: 'Full-time',
        category: 'Technology',
        salary: '$120,000 - $150,000',
        description: 'Looking for a data scientist to work on machine learning models and big data analysis.',
        featured: true
      },
      {
        title: 'Marketing Manager',
        company: companyMap['GrowthCo'],
        location: 'Chicago',
        type: 'Full-time',
        category: 'Marketing',
        salary: '$80,000 - $100,000',
        description: 'Lead our marketing team and develop strategies to increase brand awareness and customer acquisition.'
      },
      {
        title: 'Nurse Practitioner',
        company: companyMap['HealthPlus'],
        location: 'Boston',
        type: 'Full-time',
        category: 'Healthcare',
        salary: '$90,000 - $110,000',
        description: 'Seeking a licensed nurse practitioner to join our growing healthcare team.'
      }
    ];

    // Insert jobs
    await Job.insertMany(jobsData);
    console.log('Jobs seeded successfully');
  } catch (err) {
    console.error('Jobs seed error:', err);
    throw err;
  }
};

// Seed Testimonials
const seedTestimonials = async () => {
  try {
    // Clear existing testimonials
    await Testimonial.deleteMany({});

    // Sample testimonials data
    const testimonialsData = [
      {
        name: 'Sarah Johnson',
        title: 'Software Engineer',
        quote: 'Opportune helped me find my dream job in just two weeks. The platform is intuitive and the job listings are high quality.',
        avatar: '/assets/images/testimonial-1.jpg'
      },
      {
        name: 'Michael Chen',
        title: 'HR Director',
        quote: 'As a hiring manager, I\'ve found excellent candidates through Opportune. The filtering options make it easy to find the right talent.',
        avatar: '/assets/images/testimonial-2.jpg'
      },
      {
        name: 'Emily Rodriguez',
        title: 'Marketing Specialist',
        quote: 'The career resources and job alerts helped me transition to a new industry. I\'m now working in a role I love thanks to Opportune.',
        avatar: '/assets/images/testimonial-3.jpg'
      }
    ];

    // Insert testimonials
    await Testimonial.insertMany(testimonialsData);
    console.log('Testimonials seeded successfully');
  } catch (err) {
    console.error('Testimonials seed error:', err);
  }
};

// Run all seed functions
const seedAll = async () => {
  try {
    await seedAdmin();
    const companyMap = await seedCompanies();
    await seedJobs(companyMap);
    await seedTestimonials();

    console.log('All seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAll();