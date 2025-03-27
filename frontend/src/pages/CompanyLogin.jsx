// frontend/src/pages/CompanyLogin.jsx
import React from 'react';
import CompanyLoginForm from '../components/CompanyLoginForm';

function CompanyLogin() {
    return (
        <div className="container mx-auto p-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
            <p className="text-center text-gray-600 max-w-md mx-auto mb-10">
                Log in to your Opportune account to continue your job search journey.
            </p>
            <CompanyLoginForm />
        </div>
    );
}

export default CompanyLogin;