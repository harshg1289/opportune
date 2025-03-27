// frontend/src/components/CompanyRegisterationForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

function CompanyRegister() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required('Company name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            setSuccess('');
            try {
                const response = await api.post('/companies/register', values);
                setSuccess('Registration successful! Redirecting to login...');

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/company/login');
                }, 2000);
            } catch (err) {
                setError(err.response?.data?.msg || 'Registration failed');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="container mx-auto p-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Company Registration</h1>
            <div className="max-w-md mx-auto">
                <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow-md">
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
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`w-full p-2 border rounded ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter company name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Company Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`w-full p-2 border rounded ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="company@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`w-full p-2 border rounded ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="••••••••"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`w-full p-2 border rounded ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="••••••••"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/company/login" className="text-green-600 hover:underline">
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompanyRegister;