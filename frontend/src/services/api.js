// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('companyToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User authentication
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');
export const checkAuthStatus = () => api.get('/auth/me');

// Company authentication
export const registerCompany = (companyData) => api.post('/companies/register', companyData);
export const loginCompany = (credentials) => api.post('/companies/login', credentials);
export const getCompanyProfile = () => api.get('/companies/me');

// Job functions
export const fetchJobs = (params) => api.get('/jobs', { params });
export const fetchJobById = (id) => api.get(`/jobs/${id}`);
export const addJob = (jobData) => {
    console.log('API sending job data:', jobData);
    return api.post('/jobs', jobData)
        .then(response => {
            console.log('API response for job creation:', response);
            return response.data;
        });
};
export const updateJobStatus = (jobId, status) => api.patch(`/jobs/${jobId}/status`, { status });

// Application functions
export const applyForJob = (jobId) => api.post('/applications', { jobId });
export const getUserApplications = (userId) => api.get(`/applications/user/${userId}`);
export const fetchAllApplications = () => api.get('/applications');
export const updateApplicationStatus = (applicationId, status) => 
  api.patch(`/applications/${applicationId}/status`, { status });

// User profile
export const getUserProfile = (userId) => api.get(`/users/${userId}/profile`);
export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}/profile`, userData);

// Add the missing functions
export const fetchCompanies = () => api.get('/companies');
export const fetchUsers = () => api.get('/users');
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
export const deleteCompany = (companyId) => api.delete(`/companies/${companyId}`);

export const addCompanyJob = (jobData) => {
  console.log('Sending job data:', jobData);
  return api.post('/jobs/company', jobData)
      .then(response => {
          console.log('Job creation response:', response);
          return response.data;
      })
      .catch(error => {
          console.error('Job creation error:', error.response ? error.response.data : error.message);
          throw error;
      });
};
export const getCompanyJobs = () => api.get('/jobs/company');

export const updateCompanyJobStatus = (jobId, status) => api.patch(`/jobs/${jobId}/company-status`, { status });
export const deleteCompanyJob = (jobId) => api.delete(`/jobs/${jobId}/company`);

export const getRecentApplicationsForCompany = () => api.get('/applications/company');

export default api;
