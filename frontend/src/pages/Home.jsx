// // frontend/src/pages/Home.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// function Home() {
//     const [categoryCounts, setCategoryCounts] = useState([]);
//     const [featuredJobs, setFeaturedJobs] = useState([]);
//     const [testimonials, setTestimonials] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);

//                 // Fetch category counts, featured jobs, and testimonials in parallel
//                 const [categoriesRes, featuredRes, testimonialsRes] = await Promise.all([
//                     axios.get(`${API_URL}/jobs/counts`),
//                     axios.get(`${API_URL}/jobs/featured`),
//                     axios.get(`${API_URL}/testimonials`)
//                 ]);

//                 setCategoryCounts(categoriesRes.data);
//                 setFeaturedJobs(featuredRes.data);
//                 setTestimonials(testimonialsRes.data || []);

//             } catch (err) {
//                 console.error('Error fetching home page data:', err);
//                 setError('Failed to load data. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [API_URL]);

//     // Map of category icons
//     const categoryIcons = {
//         'Technology': 'fas fa-code',
//         'Business': 'fas fa-chart-line',
//         'Design': 'fas fa-palette',
//         'Marketing': 'fas fa-bullhorn',
//         'Healthcare': 'fas fa-heartbeat',
//         'Education': 'fas fa-university',
//         'Hospitality': 'fas fa-utensils',
//         'Finance': 'fas fa-user-tie',
//         'Other': 'fas fa-briefcase'
//     };

//     // Map of category colors
//     const categoryColors = {
//         'Technology': 'bg-blue-100 text-blue-600',
//         'Business': 'bg-green-100 text-green-600',
//         'Design': 'bg-purple-100 text-purple-600',
//         'Marketing': 'bg-orange-100 text-orange-600',
//         'Healthcare': 'bg-red-100 text-red-600',
//         'Education': 'bg-yellow-100 text-yellow-600',
//         'Hospitality': 'bg-pink-100 text-pink-600',
//         'Finance': 'bg-indigo-100 text-indigo-600',
//         'Other': 'bg-gray-100 text-gray-600'
//     };

//     return (
//         <div>
//             {/* Hero Section */}
//             <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-col md:flex-row items-center">
//                         <div className="md:w-1/2 mb-10 md:mb-0">
//                             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//                                 Find the Perfect Job for You
//                             </h1>
//                             <p className="text-xl mb-8">
//                                 Opportune connects you with thousands of jobs from top companies.
//                                 Start your journey to your dream career today.
//                             </p>
//                             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//                                 <Link
//                                     to="/jobs"
//                                     className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
//                                 >
//                                     Find Jobs
//                                 </Link>
//                                 <Link
//                                     to="/register"
//                                     className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors duration-300"
//                                 >
//                                     Create Account
//                                 </Link>
//                             </div>
//                         </div>
//                         <div className="md:w-1/2">
//                             <img
//                                 src="/assets/images/hero-image.svg"
//                                 alt="Job search illustration"
//                                 className="w-full max-w-md mx-auto"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Job Categories Section */}
//             <section className="py-16 bg-gray-50">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-12">Browse Job Categories</h2>

//                     {loading ? (
//                         <div className="flex justify-center">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : error ? (
//                         <div className="text-center text-red-500">{error}</div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {categoryCounts.map((category, index) => (
//                                 <Link
//                                     to={`/jobs?category=${encodeURIComponent(category.category)}`}
//                                     key={index}
//                                     className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
//                                 >
//                                     <div className={`w-14 h-14 ${categoryColors[category.category] || 'bg-gray-100 text-gray-600'} rounded-full flex items-center justify-center mb-4`}>
//                                         <i className={`${categoryIcons[category.category] || 'fas fa-briefcase'} text-xl`}></i>
//                                     </div>
//                                     <h3 className="text-xl font-semibold mb-2">{category.category}</h3>
//                                     <p className="text-gray-500">{category.count} jobs available</p>
//                                 </Link>
//                             ))}
//                         </div>

//                     )}
//                 </div>
//             </section>

//             {/* Featured Jobs Section */}
//             <section className="py-16">
//                 <div className="container mx-auto px-4">
//                     <div className="flex justify-between items-center mb-12">
//                         <h2 className="text-3xl font-bold">Featured Jobs</h2>
//                         <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
//                             View All Jobs
//                         </Link>
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : error ? (
//                         <div className="text-center text-red-500">{error}</div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {featuredJobs.map((job) => (
//                                 <div key={job._id} className="border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
//                                     <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
//                                     <p className="text-gray-700 mb-3">{job.company}</p>
//                                     <div className="flex flex-wrap gap-4 mb-4">
//                                         <div className="flex items-center text-gray-500">
//                                             <i className="fas fa-map-marker-alt mr-2"></i>
//                                             <span>{job.location}</span>
//                                         </div>
//                                         <div className="flex items-center text-gray-500">
//                                             <i className="fas fa-briefcase mr-2"></i>
//                                             <span>{job.type}</span>
//                                         </div>
//                                         <div className="flex items-center text-gray-500">
//                                             <i className="fas fa-money-bill-alt mr-2"></i>
//                                             <span>{job.salary}</span>
//                                         </div>
//                                     </div>
//                                     <Link
//                                         to={`/jobs/${job._id}`}
//                                         className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300 mt-4"
//                                     >
//                                         View Details
//                                     </Link>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* How It Works Section */}
//             <section className="py-16 bg-gray-50">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-12">How Opportune Works</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
//                                 1
//                             </div>
//                             <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
//                             <p className="text-gray-600">
//                                 Sign up for free, create a profile, and upload your resume to get started.
//                             </p>
//                         </div>
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
//                                 2
//                             </div>
//                             <h3 className="text-xl font-semibold mb-2">Search and Apply</h3>
//                             <p className="text-gray-600">
//                                 Browse thousands of jobs, filter by your preferences, and apply with just a few clicks.
//                             </p>
//                         </div>
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
//                                 3
//                             </div>
//                             <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
//                             <p className="text-gray-600">
//                                 Connect with employers, schedule interviews, and land your dream job.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Testimonials Section */}
//             <section className="py-16">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
//                     {loading ? (
//                         <div className="flex justify-center">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : error ? (
//                         <div className="text-center text-red-500">{error}</div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                             {testimonials.map((testimonial) => (
//                                 <div key={testimonial._id} className="bg-white rounded-lg shadow-md p-6">
//                                     <div className="flex items-center mb-4">
//                                         <img
//                                             src={testimonial.avatar || '/assets/images/default-avatar.jpg'}
//                                             alt={testimonial.name}
//                                             className="w-12 h-12 rounded-full mr-4"
//                                             onError={(e) => {
//                                                 e.target.onerror = null;
//                                                 e.target.src = '/assets/images/default-avatar.jpg';
//                                             }}
//                                         />
//                                         <div>
//                                             <h3 className="font-semibold">{testimonial.name}</h3>
//                                             <p className="text-gray-600 text-sm">{testimonial.title}</p>
//                                         </div>
//                                     </div>
//                                     <blockquote className="text-gray-700 italic">
//                                         "{testimonial.quote}"
//                                     </blockquote>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section className="bg-blue-600 text-white py-16">
//                 <div className="container mx-auto px-4 text-center">
//                     <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
//                     <p className="text-xl mb-8 max-w-2xl mx-auto">
//                         Join thousands of job seekers who have found their dream job through Opportune.
//                     </p>
//                     <div className="flex flex-col sm:flex-row justify-center gap-4">
//                         <Link
//                             to="/register"
//                             className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
//                         >
//                             Create an Account
//                         </Link>
//                         <Link
//                             to="/jobs"
//                             className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors duration-300"
//                         >
//                             Browse Jobs
//                         </Link>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default Home;









// In Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Add this import

function Home() {
    const { user, isAuthenticated } = useContext(AuthContext); // Add this line
    const [categoryCounts, setCategoryCounts] = useState([]);
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch category counts, featured jobs, and testimonials in parallel
                const [categoriesRes, featuredRes, testimonialsRes] = await Promise.all([
                    axios.get(`${API_URL}/jobs/counts`),
                    axios.get(`${API_URL}/jobs/featured`),
                    axios.get(`${API_URL}/testimonials`)
                ]);

                setCategoryCounts(categoriesRes.data);
                setFeaturedJobs(featuredRes.data);
                setTestimonials(testimonialsRes.data || []);

            } catch (err) {
                console.error('Error fetching home page data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    // Map of category icons
    const categoryIcons = {
        'Technology': 'fas fa-code',
        'Business': 'fas fa-chart-line',
        'Design': 'fas fa-palette',
        'Marketing': 'fas fa-bullhorn',
        'Healthcare': 'fas fa-heartbeat',
        'Education': 'fas fa-university',
        'Hospitality': 'fas fa-utensils',
        'Finance': 'fas fa-user-tie',
        'Other': 'fas fa-briefcase'
    };

    // Map of category colors
    const categoryColors = {
        'Technology': 'bg-blue-100 text-blue-600',
        'Business': 'bg-green-100 text-green-600',
        'Design': 'bg-purple-100 text-purple-600',
        'Marketing': 'bg-orange-100 text-orange-600',
        'Healthcare': 'bg-red-100 text-red-600',
        'Education': 'bg-yellow-100 text-yellow-600',
        'Hospitality': 'bg-pink-100 text-pink-600',
        'Finance': 'bg-indigo-100 text-indigo-600',
        'Other': 'bg-gray-100 text-gray-600'
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Find the Perfect Job for You
                            </h1>
                            <p className="text-xl mb-8">
                                Opportune connects you with thousands of jobs from top companies.
                                Start your journey to your dream career today.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to="/jobs"
                                    className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
                                >
                                    Find Jobs
                                </Link>
                                {!isAuthenticated && (
                                    <Link
                                        to="/register"
                                        className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors duration-300"
                                    >
                                        Create Account
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="/assets/images/hero-image.svg"
                                alt="Job search illustration"
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Browse Job Categories</h2>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryCounts.map((category, index) => (
                                <Link
                                    to={`/jobs?category=${encodeURIComponent(category.category)}`}
                                    key={index}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                                >
                                    <div className={`w-14 h-14 ${categoryColors[category.category] || 'bg-gray-100 text-gray-600'} rounded-full flex items-center justify-center mb-4`}>
                                        <i className={`${categoryIcons[category.category] || 'fas fa-briefcase'} text-xl`}></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{category.category}</h3>
                                    <p className="text-gray-500">{category.count} jobs available</p>
                                </Link>
                            ))}
                        </div>

                    )}
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold">Featured Jobs</h2>
                        <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
                            View All Jobs
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredJobs.map((job) => (
                                <div key={job._id} className="border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                    <p className="text-gray-700 mb-3">{job.company?.name || (typeof job.company === 'string' ? job.company : "Unknown Company")}</p>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <i className="fas fa-briefcase mr-2"></i>
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <i className="fas fa-money-bill-alt mr-2"></i>
                                            <span>{job.salary}</span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300 mt-4"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How Opportune Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                            <p className="text-gray-600">
                                Sign up for free, create a profile, and upload your resume to get started.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Search and Apply</h3>
                            <p className="text-gray-600">
                                Browse thousands of jobs, filter by your preferences, and apply with just a few clicks.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
                            <p className="text-gray-600">
                                Connect with employers, schedule interviews, and land your dream job.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial._id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar || '/assets/images/default-avatar.jpg'}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/assets/images/default-avatar.jpg';
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-semibold">{testimonial.name}</h3>
                                            <p className="text-gray-600 text-sm">{testimonial.title}</p>
                                        </div>
                                    </div>
                                    <blockquote className="text-gray-700 italic">
                                        "{testimonial.quote}"
                                    </blockquote>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of job seekers who have found their dream job through Opportune.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {!isAuthenticated && (
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
                            >
                                Create an Account
                            </Link>
                        )}
                        <Link
                            to="/jobs"
                            className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors duration-300"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;