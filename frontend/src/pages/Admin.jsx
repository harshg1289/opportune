// frontend/src/pages/Admin.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

function Admin() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!isAuthenticated || !user?.isAdmin)) {
                navigate('/login');
        }
    }, [isAuthenticated, user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <AdminDashboard />;
}

export default Admin;