// // frontend/src/components/JobList.jsx
// import React, { useState, useEffect } from 'react';
// import JobCard from './JobCard';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// function JobList() {
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const location = useLocation();

//     // Get category from URL directly
//     const urlParams = new URLSearchParams(location.search);
//     const categoryFromURL = urlParams.get('category');

//     // Local search filters state
//     const [filters, setFilters] = useState({
//         location: '',
//         jobType: '',
//         salary: '',
//         query: '',
//         category: categoryFromURL || '' // Initialize with URL category if present
//     });

//     // Function to fetch jobs
//     const fetchJobs = async () => {
//         try {
//             setLoading(true);

//             // Create query parameters
//             const params = new URLSearchParams();
//             if (filters.query) params.append('query', filters.query);
//             if (filters.location) params.append('location', filters.location);
//             if (filters.jobType) params.append('jobType', filters.jobType);
//             if (filters.salary) params.append('salary', filters.salary);
//             if (filters.category) params.append('category', filters.category);

//             // Make the API request
//             const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
//             const response = await axios.get(`${API_URL}/jobs?${params.toString()}`);

//             // Process the response
//             const data = response.data;
//             const jobsData = data.jobs || data;

//             setJobs(Array.isArray(jobsData) ? jobsData : []);
//             setError(null);
//         } catch (err) {
//             console.error('Error fetching jobs:', err);
//             setError('Failed to load jobs. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch jobs when component mounts and when filters change
//     useEffect(() => {
//         fetchJobs();
//     }, [location.search]); // Only re-fetch when URL changes

//     // Handle filter form submission
//     const handleSearch = (e) => {
//         e.preventDefault();
//         fetchJobs();
//     };

//     // Handle filter input changes
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     // Clear category filter
//     const clearCategoryFilter = () => {
//         setFilters(prev => ({ ...prev, category: '' }));
//         fetchJobs();
//     };

//     return (
//         <div className="container mx-auto p-4">
//             {/* Active category filter indicator */}
//             {(filters.category || filters.location || filters.jobType || filters.salary || filters.query) && (
//                 <div className="bg-blue-100 p-3 rounded-md mb-4">
//                     <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-semibold">Active Filters:</h3>
//                         <button
//                             onClick={() => {
//                                 setFilters({
//                                     location: '',
//                                     jobType: '',
//                                     salary: '',
//                                     query: '',
//                                     category: ''
//                                 });
//                                 fetchJobs();
//                             }}
//                             className="text-blue-700 hover:text-blue-900"
//                         >
//                             Clear All Filters
//                         </button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                         {filters.category && (
//                             <div className="bg-blue-500 text-white px-2 py-1 rounded flex items-center">
//                                 <span className="mr-1">Category: {filters.category}</span>
//                                 <button
//                                     onClick={() => {
//                                         setFilters(prev => ({ ...prev, category: '' }));
//                                         fetchJobs();
//                                     }}
//                                     className="text-white hover:text-blue-200"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         )}
//                         {filters.location && (
//                             <div className="bg-green-500 text-white px-2 py-1 rounded flex items-center">
//                                 <span className="mr-1">Location: {filters.location}</span>
//                                 <button
//                                     onClick={() => {
//                                         setFilters(prev => ({ ...prev, location: '' }));
//                                         fetchJobs();
//                                     }}
//                                     className="text-white hover:text-green-200"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         )}
//                         {filters.jobType && (
//                             <div className="bg-purple-500 text-white px-2 py-1 rounded flex items-center">
//                                 <span className="mr-1">Job Type: {filters.jobType}</span>
//                                 <button
//                                     onClick={() => {
//                                         setFilters(prev => ({ ...prev, jobType: '' }));
//                                         fetchJobs();
//                                     }}
//                                     className="text-white hover:text-purple-200"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         )}
//                         {filters.salary && (
//                             <div className="bg-orange-500 text-white px-2 py-1 rounded flex items-center">
//                                 <span className="mr-1">Salary: {filters.salary}</span>
//                                 <button
//                                     onClick={() => {
//                                         setFilters(prev => ({ ...prev, salary: '' }));
//                                         fetchJobs();
//                                     }}
//                                     className="text-white hover:text-orange-200"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         )}
//                         {filters.query && (
//                             <div className="bg-red-500 text-white px-2 py-1 rounded flex items-center">
//                                 <span className="mr-1">Search: {filters.query}</span>
//                                 <button
//                                     onClick={() => {
//                                         setFilters(prev => ({ ...prev, query: '' }));
//                                         fetchJobs();
//                                     }}
//                                     className="text-white hover:text-red-200"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Search form */}
//             <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6">
//                 <h2 className="text-xl font-semibold mb-4">Search Jobs</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <input
//                         type="text"
//                         name="query"
//                         placeholder="Job title or keyword"
//                         className="border p-2 rounded"
//                         value={filters.query}
//                         onChange={handleFilterChange}
//                     />
//                     <select
//                         name="location"
//                         className="border p-2 rounded"
//                         value={filters.location}
//                         onChange={handleFilterChange}
//                     >
//                         <option value="">All Locations</option>
//                         <option value="Remote">Remote</option>
//                         <option value="New York">New York</option>
//                         <option value="San Francisco">San Francisco</option>
//                     </select>
//                     <select
//                         name="jobType"
//                         className="border p-2 rounded"
//                         value={filters.jobType}
//                         onChange={handleFilterChange}
//                     >
//                         <option value="">All Types</option>
//                         <option value="Full-time">Full-time</option>
//                         <option value="Part-time">Part-time</option>
//                         <option value="Contract">Contract</option>
//                         <option value="Internship">Internship</option>
//                     </select>
//                     <select
//                         name="category"
//                         className="border p-2 rounded"
//                         value={filters.category}
//                         onChange={handleFilterChange}
//                     >
//                         <option value="">All Categories</option>
//                         <option value="Technology">Technology</option>
//                         <option value="Business">Business</option>
//                         <option value="Design">Design</option>
//                         <option value="Marketing">Marketing</option>
//                         <option value="Healthcare">Healthcare</option>
//                         <option value="Education">Education</option>
//                         <option value="Hospitality">Hospitality</option>
//                         <option value="Finance">Finance</option>
//                     </select>
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                     >
//                         Search Jobs
//                     </button>
//                 </div>
//             </form>

//             {/* Jobs list with loading and error states */}
//             {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             ) : error ? (
//                 <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
//                     {error}
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {jobs.length > 0 ? (
//                         jobs.map(job => <JobCard key={job._id} job={job} />)
//                     ) : (
//                         <div className="col-span-full text-center p-10">
//                             <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
//                             <p className="text-gray-500 mt-2">Try adjusting your filters or check back later for new opportunities.</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default JobList;





// frontend/src/components/JobList.jsx
import React, { useState, useEffect, useContext } from 'react';
import JobCard from './JobCard';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function JobList({ categoryFilter }) {
    const [jobs, setJobs] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { user, isAuthenticated } = useContext(AuthContext);

    // Get category from URL directly or from props
    const urlParams = new URLSearchParams(location.search);
    const categoryFromURL = categoryFilter || urlParams.get('category');

    // Local search filters state
    const [filters, setFilters] = useState({
        location: '',
        jobType: '',
        salary: '',
        query: '',
        category: categoryFromURL || '' // Initialize with URL category if present
    });

    // Function to fetch jobs
    const fetchJobs = async () => {
        try {
            setLoading(true);

            // Create query parameters
            const params = new URLSearchParams();
            if (filters.query) params.append('query', filters.query);
            if (filters.location) params.append('location', filters.location);
            if (filters.jobType) params.append('jobType', filters.jobType);
            if (filters.salary) params.append('salary', filters.salary);
            if (filters.category) params.append('category', filters.category);

            // Make the API request
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
            const response = await axios.get(`${API_URL}/jobs?${params.toString()}`);

            // Process the response
            const data = response.data;
            const jobsData = data.jobs || data;

            setJobs(Array.isArray(jobsData) ? jobsData : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user applications to check which jobs user has already applied for
    const fetchUserApplications = async () => {
        if (isAuthenticated && user) {
            try {
                const applications = await api.get(`/applications/user/${user.id}`);
                setUserApplications(applications.data);
            } catch (err) {
                console.error('Error fetching user applications:', err);
            }
        }
    };

    // Fetch jobs when component mounts and when filters change
    useEffect(() => {
        fetchJobs();
        fetchUserApplications();
    }, [location.search, isAuthenticated, user]); // Re-fetch when URL or user auth changes

    // Handle filter form submission
    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    // Handle filter input changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Check if user has applied to a specific job
    const hasAppliedToJob = (jobId) => {
        return userApplications.some(app => app.job._id === jobId);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Active category filter indicator */}
            {(filters.category || filters.location || filters.jobType || filters.salary || filters.query) && (
                <div className="bg-blue-100 p-3 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Active Filters:</h3>
                        <button
                            onClick={() => {
                                setFilters({
                                    location: '',
                                    jobType: '',
                                    salary: '',
                                    query: '',
                                    category: ''
                                });
                                fetchJobs();
                            }}
                            className="text-blue-700 hover:text-blue-900"
                        >
                            Clear All Filters
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filters.category && (
                            <div className="bg-blue-500 text-white px-2 py-1 rounded flex items-center">
                                <span className="mr-1">Category: {filters.category}</span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, category: '' }));
                                        fetchJobs();
                                    }}
                                    className="text-white hover:text-blue-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {filters.location && (
                            <div className="bg-green-500 text-white px-2 py-1 rounded flex items-center">
                                <span className="mr-1">Location: {filters.location}</span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, location: '' }));
                                        fetchJobs();
                                    }}
                                    className="text-white hover:text-green-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {filters.jobType && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded flex items-center">
                                <span className="mr-1">Job Type: {filters.jobType}</span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, jobType: '' }));
                                        fetchJobs();
                                    }}
                                    className="text-white hover:text-purple-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {filters.salary && (
                            <div className="bg-orange-500 text-white px-2 py-1 rounded flex items-center">
                                <span className="mr-1">Salary: {filters.salary}</span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, salary: '' }));
                                        fetchJobs();
                                    }}
                                    className="text-white hover:text-orange-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {filters.query && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded flex items-center">
                                <span className="mr-1">Search: {filters.query}</span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, query: '' }));
                                        fetchJobs();
                                    }}
                                    className="text-white hover:text-red-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Search form */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Search Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                        type="text"
                        name="query"
                        placeholder="Job title or keyword"
                        className="border p-2 rounded"
                        value={filters.query}
                        onChange={handleFilterChange}
                    />
                    <select
                        name="location"
                        className="border p-2 rounded"
                        value={filters.location}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        <option value="New York">New York</option>
                        <option value="San Francisco">San Francisco</option>
                    </select>
                    <select
                        name="jobType"
                        className="border p-2 rounded"
                        value={filters.jobType}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                    <select
                        name="category"
                        className="border p-2 rounded"
                        value={filters.category}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Categories</option>
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
                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Search Jobs
                    </button>
                </div>
            </form>

            {/* Jobs list with loading and error states */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                hasApplied={hasAppliedToJob(job._id)}
                                onApplicationSubmit={fetchUserApplications} // Refresh applications after applying
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center p-10">
                            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later for new opportunities.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default JobList;


