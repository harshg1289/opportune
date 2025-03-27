// frontend/src/components/Footer.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Footer() {
    const { user, company } = useContext(AuthContext);
    
    return (
        <footer className="bg-gray-800 text-white mt-10">
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Opportune</h3>
                        <p className="text-gray-400">
                            Connecting talents with opportunities. Find your dream job or the perfect candidate.
                        </p>
                    </div>
                    
                    {/* Hide "For Job Seekers" section if company or admin is logged in */}
                    {(!company && (!user || !user.isAdmin)) && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">For Job Seekers</h3>
                            <ul className="space-y-2">
                                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                                {/* Hide "Create Account" if user is logged in */}
                                {!user && (
                                    <li><Link to="/register" className="text-gray-400 hover:text-white">Create Account</Link></li>
                                )}
                                <li><Link to="/profile" className="text-gray-400 hover:text-white">Job Alerts</Link></li>
                                <li><Link to="/resources" className="text-gray-400 hover:text-white">Career Resources</Link></li>
                            </ul>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-lg font-bold mb-4">For Employers</h3>
                        <ul className="space-y-2">
                            <li><Link to="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                            <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                            <li><Link to="/resources" className="text-gray-400 hover:text-white">Hiring Resources</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400">© 2025 Opportune. All rights reserved.</p>
                    
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
