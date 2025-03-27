// frontend/src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function RegistrationForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required')
    });

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            
            try {
                await registerUser({
                    name: values.fullName,
                    email: values.email,
                    password: values.password
                });
                
                navigate('/login', { state: { message: 'Registration successful! Please login.' } });
            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 mb-2">Full Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        className={`border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded`}
                        {...formik.getFieldProps('fullName')}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.fullName}</p>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        className={`border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded`}
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        className={`border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded`}
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                    )}
                </div>
                
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        className={`border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded`}
                        {...formik.getFieldProps('confirmPassword')}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                    )}
                </div>
                
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;