// frontend/src/pages/CompanyRegister.jsx
import React from 'react';
import CompanyRegistrationForm from '../components/CompanyRegisterationForm';

function CompanyRegister() {
    return (
        <div className="container mx-auto p-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
            <p className="text-center text-gray-600 max-w-md mx-auto mb-10">
                Join Opportune to access thousands of job listings and connect with top employers.
            </p>
            <CompanyRegistrationForm />
        </div>
    );
}

export default CompanyRegister;