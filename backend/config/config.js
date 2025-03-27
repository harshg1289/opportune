// config/config.js
require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 8080,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // Database configuration
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/opportune',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your_default_jwt_secret',
  jwtExpiration: '7d', // Token expires in 7 days
  
  // File upload configuration
  uploadPath: 'uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
  allowedFileTypes: ['.pdf', '.doc', '.docx'],
  
  // Pagination defaults
  defaultPage: 1,
  defaultLimit: 20,
  
  // Email configuration (if you implement email features later)
  emailFrom: process.env.EMAIL_FROM || 'noreply@opportune.com',
  
  // Environment
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};
