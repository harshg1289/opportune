// frontend/src/app.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import CompanyLogin from './pages/CompanyLogin';
import CompanyRegister from './pages/CompanyRegister';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProfilePage from './components/ProfilePage';
import CompanyDashboard from './components/CompanyDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, companyOnly = false }) => {
    const { user, company, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (companyOnly && !company) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const RestrictedRoute = ({ children }) => {
    const { user, company } = useContext(AuthContext);

    if (company) {
        return <Navigate to="/company/dashboard" replace />;
    }

    if (user?.isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={
                                <RestrictedRoute>
                                    <Home />
                                </RestrictedRoute>
                            } />
                            <Route path="/jobs" element={
                                <RestrictedRoute>
                                    <Jobs />
                                </RestrictedRoute>
                            } />
                            <Route path="/about" element={<About />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/company/login" element={<CompanyLogin />} />

                            <Route path="/register" element={<Register />} />
                            <Route path="/company/register" element={<CompanyRegister />} />
                            <Route
                                path="/company/dashboard"
                                element={
                                    <ProtectedRoute companyOnly={true}>
                                        <CompanyDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
