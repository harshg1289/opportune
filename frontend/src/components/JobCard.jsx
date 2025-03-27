// // frontend/src/components/JobCard.jsx
// import React, { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { applyForJob } from '../services/api';

// function JobCard({ job }) {
//     const { user, isAuthenticated } = useContext(AuthContext);

//     const handleApply = async () => {
//         if (!isAuthenticated) {
//             alert('Please login to apply for this job');
//             return;
//         }

//         try {
//             await applyForJob(job._id); // Using MongoDB _id
//             alert('Application submitted successfully!');
//         } catch (error) {
//             console.error('Error applying for job:', error);
//             if (error.response?.status === 400 && error.response?.data?.message) {
//                 alert(error.response.data.message);
//             } else {
//                 alert('Failed to submit application. Please try again.');
//             }
//         }
//     };

//     return (
//         <div className="border rounded-lg shadow-md p-4 m-2 hover:shadow-lg transition-shadow duration-300">
//             <h2 className="text-xl font-semibold">{job.title}</h2>
//             <p className="text-gray-700">{job.company}</p>
//             <div className="flex items-center mt-2">
//                 <i className="fa fa-map-marker text-gray-500 mr-1"></i>
//                 <p className="text-gray-500">{job.location}</p>
//             </div>
//             <div className="flex items-center mt-2">
//                 <i className="fa fa-briefcase text-gray-500 mr-1"></i>
//                 <p className="text-gray-500">{job.type}</p>
//             </div>
//             <div className="flex items-center mt-2">
//                 <i className="fa fa-money-bill-alt text-gray-500 mr-1"></i>
//                 <p className="text-gray-500">{job.salary}</p>
//             </div>
//             <div className="mt-2">
//                 <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                     {job.category}
//                 </span>
//             </div>
//             <p className="mt-2 text-gray-600 line-clamp-3">{job.description}</p>
//             <button 
//                 onClick={handleApply}
//                 className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
//             >
//                 Apply Now
//             </button>
//         </div>
//     );
// }

// export default JobCard;





// frontend/src/components/JobCard.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { applyForJob } from '../services/api';

function JobCard({ job, hasApplied, onApplicationSubmit }) {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleApply = async () => {
        if (!isAuthenticated) {
            alert('Please login to apply for this job');
            return;
        }

        if (hasApplied) {
            alert('You have already applied for this job');
            return;
        }

        setLoading(true);
        try {
            await applyForJob(job._id);
            alert('Application submitted successfully!');
            // Notify parent component to refresh applications list
            if (onApplicationSubmit) {
                onApplicationSubmit();
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            if (error.response?.status === 400 && error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to submit application. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg shadow-md p-4 m-2 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.company?.name || job.companyName || (job.company && typeof job.company === 'string' ? job.company : "Unknown Company")}</p>
            <div className="flex items-center mt-2">
                <i className="fa fa-map-marker text-gray-500 mr-1"></i>
                <p className="text-gray-500">{job.location}</p>
            </div>
            <div className="flex items-center mt-2">
                <i className="fa fa-briefcase text-gray-500 mr-1"></i>
                <p className="text-gray-500">{job.type}</p>
            </div>
            <div className="flex items-center mt-2">
                <i className="fa fa-money-bill-alt text-gray-500 mr-1"></i>
                <p className="text-gray-500">{job.salary}</p>
            </div>
            <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {job.category}
                </span>
            </div>
            <p className="mt-2 text-gray-600 line-clamp-3">{job.description}</p>
            <button 
                onClick={handleApply}
                disabled={hasApplied || loading}
                className={`mt-4 py-2 px-4 rounded transition-colors duration-300 w-full ${
                    hasApplied 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {loading ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
            </button>
        </div>
    );
}

export default JobCard;
