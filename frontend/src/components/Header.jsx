// frontend/src/components/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
    const { user, company, logout } = useContext(AuthContext);

    return (
        <header className="flex justify-between items-center bg-gray-800 p-4">
            <div className="text-white text-lg font-bold">Opportune</div>

            <nav className="flex space-x-4">
                <Link to="/" className="text-white hover:text-gray-400">Home</Link>
                <Link to="/jobs" className="text-white hover:text-gray-400">Find Jobs</Link>
                {user?.isAdmin && (
                    <Link to="/admin" className="text-white hover:text-gray-400">Admin</Link>
                )}
                {company && (
                    <Link to="/company/dashboard" className="text-white hover:text-gray-400">Company Dashboard</Link>
                )}
                <Link to="/about" className="text-white hover:text-gray-400">About Us</Link>
            </nav>

            <div className="flex items-center">
                {company ? (
                    <>
                        <span className="text-white ml-2">{company.name}</span>
                        <Link to="/company/dashboard" className="text-white hover:text-gray-400">
                            Dashboard
                        </Link>
                        <button
                            onClick={logout}
                            className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : user ? (
                    <>
                        <Link to="/profile" className="text-white hover:text-gray-400">
                            <i className="fa fa-user mr-2"></i>
                            {user.name}
                        </Link>
                        <button
                            onClick={logout}
                            className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div className="space-x-2">
                        <Link to="/login" className="text-white hover:text-gray-400">User Login</Link>
                        <Link to="/company/login" className="text-white hover:text-gray-400">Company Login</Link>
                        <span className="text-white">|</span>
                        <Link to="/register" className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                            User Register
                        </Link>
                        <Link to="/company/register" className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                            Company Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;