// frontend/src/components/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, getUserApplications } from '../services/api';

function ProfilePage() {
    const { user, company } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
        skills: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await getUserProfile(user.id);
                const applicationsData = await getUserApplications(user.id);

                // Add check for company user
                if (profileData?.company) {
                    navigate('/company/dashboard');
                    return;
                }

                setProfile(profileData);
                setApplications(applicationsData);

                setFormData({
                    name: profileData.name || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    skills: profileData.skills || ''
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to load profile data');
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('skills', formData.skills);

            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }

            const updatedProfile = await updateUserProfile(user._id, formDataToSend);

            // Update profile state with new data from server response
            setProfile(updatedProfile);

            setSuccess('Profile updated successfully');
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded shadow-md">
                        {!editMode ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Personal Information</h2>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                    >
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-gray-500 text-sm">Name</h3>
                                    <p>{profile.name}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-gray-500 text-sm">Email</h3>
                                    <p>{profile.email}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-gray-500 text-sm">Phone</h3>
                                    <p>{profile.phone || 'Not specified'}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-gray-500 text-sm">Resume</h3>
                                    {profile.resumeUrl ? (
                                        <a
                                            href={profile.resumeUrl}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Resume
                                        </a>
                                    ) : (
                                        <p>No resume uploaded</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-gray-500 text-sm">Skills</h3>
                                    <p>{profile.skills || 'No skills specified'}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="resume" className="block text-gray-700 mb-2">Resume</label>
                                    <input
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                        accept=".pdf,.doc,.docx"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="skills" className="block text-gray-700 mb-2">Skills</label>
                                    <textarea
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                        rows="3"
                                        placeholder="Enter your skills (e.g., JavaScript, React, Node.js)"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                        disabled={updating}
                                    >
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div>
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Job Applications</h2>

                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map(app => (
                                    <div key={app.id} className="border-b pb-3">
                                        <h3 className="font-medium">{app.job.title}</h3>
                                        <p className="text-gray-700 text-sm">{app.job.company}</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                                        </p>
                                        <p className="mt-1">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            app.status === 'Reviewing' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                        )}

                        <div className="mt-6">
                            <Link
                                to="/jobs"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full block text-center"
                            >
                                Find Jobs to Apply
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;