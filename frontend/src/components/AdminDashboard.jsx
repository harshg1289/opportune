// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchJobs, fetchAllApplications, addJob, updateJobStatus, updateApplicationStatus, fetchCompanies, fetchUsers, deleteUser, deleteCompany } from '../services/api';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddJobForm, setShowAddJobForm] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        category: 'Technology',
        salary: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {   
                const [jobsResponse, applicationsResponse, companiesResponse, usersResponse] = await Promise.all([
                    fetchJobs(),
                    fetchAllApplications(),
                    fetchCompanies(),
                    fetchUsers()
                ]);

                // Extract data from responses correctly
                const jobsData = jobsResponse.jobs || 
                         (jobsResponse.data && jobsResponse.data.jobs) || 
                         jobsResponse || [];
                const applicationsData = applicationsResponse.data || applicationsResponse;
                const companiesData = companiesResponse.data || companiesResponse;
                const usersData = usersResponse.data || usersResponse;

                // Ensure jobs is an array
                setJobs(Array.isArray(jobsData) ? jobsData : []);

                // Ensure applications is an array
                setApplications(Array.isArray(applicationsData) ? applicationsData : []);

                // Ensure companies is an array
                setCompanies(Array.isArray(companiesData) ? companiesData : []);

                setUsers(Array.isArray(usersData) ? usersData : []);

                setLoading(false);
            } catch (err) {
                console.error('Failed to load data:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };


        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({ ...prev, [name]: value }));
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            // Make sure company is selected
            if (!newJob.company) {
                setError('Please select a company');
                return;
            }
    
            console.log('Submitting job data:', newJob);
            
            const response = await addJob(newJob);
            console.log('Job creation response:', response);
            
            // Handle the response correctly
            const addedJob = response.data || response;
            
            setJobs(prev => [...prev, addedJob]);
            setSuccess('Job added successfully');
            setNewJob({
                title: '',
                company: '',
                location: '',
                type: 'Full-time',
                category: 'Technology',
                salary: '',
                description: ''
            });
            setShowAddJobForm(false);
        } catch (err) {
            console.error('Error adding job:', err);
            setError(err.response?.data?.message || 'Failed to add job. Please try again.');
        }
    };
    

    const handleUpdateJobStatus = async (jobId, status) => {
        try {
            await updateJobStatus(jobId, status);
            setJobs(prev => prev.map(job =>
                job._id === jobId ? { ...job, status } : job
            ));
            setSuccess(`Job status updated to ${status}`);
        } catch (err) {
            setError('Failed to update job status');
        }
    };

    const handleUpdateApplicationStatus = async (applicationId, status) => {
        try {
            await updateApplicationStatus(applicationId, status);
            setApplications(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status } : app
            ));
            setSuccess(`Application status updated to ${status}`);
        } catch (err) {
            setError('Failed to update application status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(prev => prev.filter(user => user._id !== userId));
                setSuccess('User deleted successfully');
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    const handleDeleteCompany = async (companyId) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await deleteCompany(companyId);
                setCompanies(prev => prev.filter(company => company._id !== companyId));
                setSuccess('Company deleted successfully');
            } catch (err) {
                setError('Failed to delete company');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="flex border-b mb-4">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'jobs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Manage Jobs
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'applications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Applications
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'companies' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('companies')}
                >
                    Companies
                </button>
            </div>

            {activeTab === 'jobs' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Job Listings</h2>
                        <button
                            onClick={() => setShowAddJobForm(!showAddJobForm)}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        >
                            {showAddJobForm ? 'Cancel' : 'Add New Job'}
                        </button>
                    </div>

                    {showAddJobForm && (
                        <div className="bg-white p-4 rounded shadow-md mb-4">
                            <h3 className="text-lg font-medium mb-4">Add New Job</h3>
                            <form onSubmit={handleAddJob}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="title" className="block text-gray-700 mb-2">Job Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newJob.title}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="block text-gray-700 mb-2">Company</label>
                                        <select
                                            id="company"
                                            name="company"
                                            value={newJob.company}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                            required
                                        >
                                            <option value="">Select a company</option>
                                            {companies.map(company => (
                                                <option key={company._id} value={company._id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={newJob.location}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-gray-700 mb-2">Job Type</label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={newJob.type}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={newJob.category}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                        >
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="Hospitality">Hospitality</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="salary" className="block text-gray-700 mb-2">Salary</label>
                                        <input
                                            type="text"
                                            id="salary"
                                            name="salary"
                                            value={newJob.salary}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 w-full rounded"
                                            placeholder="e.g., $50,000 - $70,000"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newJob.description}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Add Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.length > 0 ? (
                                    jobs.map(job => (
                                        <tr key={job._id || job.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{job.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.company?.name || job.companyName || "Unknown Company"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    job.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {job.status !== 'Active' && (
                                                        <button
                                                            onClick={() => handleUpdateJobStatus(job._id, 'Active')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                    {job.status !== 'Paused' && (
                                                        <button
                                                            onClick={() => handleUpdateJobStatus(job._id, 'Paused')}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            Pause
                                                        </button>
                                                    )}
                                                    {job.status !== 'Closed' && (
                                                        <button
                                                            onClick={() => handleUpdateJobStatus(job._id, 'Closed')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Close
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No jobs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map(app => (
                                    <tr key={app._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{app.user?.name}</div>
                                            <div className="text-gray-500">{app.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.job?.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.job?.company?.name || app.job?.companyName || "Unknown Company"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(app.appliedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                app.status === 'Reviewing' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {app.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateApplicationStatus(app._id, 'Reviewing')}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Review
                                                    </button>
                                                )}
                                                {(app.status === 'Pending' || app.status === 'Reviewing') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateApplicationStatus(app._id, 'Approved')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateApplicationStatus(app._id, 'Rejected')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'companies' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Manage Companies</h2>
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {companies.map(company => (
                                    <tr key={company._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{company.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.industry}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.size}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;