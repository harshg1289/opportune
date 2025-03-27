// frontend/src/components/CompanyLoginForm.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function CompanyLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { companyLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try {
                await companyLogin(values.email, values.password);
                navigate('/company/dashboard');
            } catch (err) {
                setError(err.response?.data?.msg || 'Invalid credentials');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="container mx-auto p-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Company Login</h1>
            <div className="max-w-md mx-auto">
                <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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

                    <div className="mb-6">
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

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="mr-2"
                                checked={formik.values.remember}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="remember" className="text-gray-600 text-sm">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link to="/company/register" className="text-green-600 hover:underline">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}