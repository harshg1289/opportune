// frontend/src/components/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function LoginForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message || '';

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
                await login(values.email, values.password);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid email or password');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
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
                
                <div className="mb-6">
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
                
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;