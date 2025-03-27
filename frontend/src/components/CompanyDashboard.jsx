import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getCompanyJobs, getRecentApplicationsForCompany } from '../services/api';

function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    category: 'Technology',
    salary: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsResponse = await api.getCompanyJobs();
      const applicationsResponse = await api.get('/companies/applications');
      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      alert('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addJob(newJob);
      alert('Job posted successfully!');
      setNewJob({
        title: '',
        location: '',
        type: 'Full-time',
        category: 'Technology',
        salary: '',
        description: ''
      });
      fetchData();
    } catch (err) {
      console.error('Error posting job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to post job';
      alert(errorMessage);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      if (action === 'pause' || action === 'activate') {
        await api.updateCompanyJobStatus(jobId, action === 'pause' ? 'Paused' : 'Active');
      } else if (action === 'delete') {
        await api.deleteCompanyJob(jobId);
      }
      fetchData();
    } catch (err) {
      console.error('Error performing job action:', err.message);
      alert('Failed to perform action. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Posting Form */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter job title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter job location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  id="category"
                  value={newJob.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  name="type"
                  id="type"
                  value={newJob.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={newJob.salary}
                  onChange={handleInputChange}
                  required
                  placeholder="$50,000 - $70,000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={newJob.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter job description..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-blue-200"
            >
              Add Job
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
          {jobs.map(job => (
            <div key={job._id} className="mb-4 p-4 border rounded">
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-gray-600">{job.location}</p>
              <div className="mt-2 flex justify-between">
                <span className={`badge ${job.status.toLowerCase()}`}>{job.status}</span>
                <div>
                  <button
                    onClick={() => handleJobAction(job._id, job.status === 'Active' ? 'pause' : 'activate')}
                    className="text-yellow-600 hover:underline mr-2"
                  >
                    {job.status === 'Active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleJobAction(job._id, 'delete')}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          {applications.map(application => (
            <div key={application._id} className="mb-4 p-4 border rounded">
              <h3 className="font-medium">{application.user?.name}</h3>
              <p className="text-gray-600">{application.job?.title}</p>
              <p className="text-gray-500 text-sm">Applied on: {new Date(application.appliedDate).toLocaleDateString()}</p>
              <span className={`badge ${application.status.toLowerCase()}`}>
                {application.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
