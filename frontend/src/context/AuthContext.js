// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add userLogin function
    const userLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            throw error;
        }
    };

    const companyLogin = async (email, password) => {
        try {
            const response = await api.post('/companies/login', { email, password });
            localStorage.setItem('companyToken', response.data.token);
            setCompany(response.data.company);
            // return response.data.company;
        } catch (error) {
            throw error;
        }
    };

    const isCompany = () => !!company;


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('companyToken');
        setUser(null);
        setCompany(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const companyToken = localStorage.getItem('companyToken');

                if (token) {
                    api.defaults.headers['Authorization'] = `Bearer ${token}`;
                    const userData = await api.get('/auth/me');
                    setUser(userData.data);
                } else if (companyToken) {
                    api.defaults.headers['Authorization'] = `Bearer ${companyToken}`;
                    const companyData = await api.get('/companies/me');
                    setCompany(companyData.data);
                }
            } catch (error) {
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            company,
            loading,
            login: userLogin,
            companyLogin,
            logout,
            isAuthenticated: !!user || !!company,
            isCompany
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};