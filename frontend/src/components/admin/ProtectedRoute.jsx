import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = ({ children, allowedRoles = ['recruiter'] }) => {
    const { authUser, loading } = useSelector(store => store.auth)
    const navigate = useNavigate()
    
    useEffect(() => {
        // Don't redirect while loading
        if (loading) return
        
        // If user is not authenticated, redirect to login
        if (!authUser) {
            navigate('/login')
            return
        }
        
        // If user role is not in allowed roles, redirect appropriately
        if (!allowedRoles.includes(authUser.role)) {
            if (authUser.role === 'student') {
                navigate('/')
            } else if (authUser.role === 'recruiter') {
                navigate('/admin/companies')
            }
        }
    }, [authUser, loading, navigate, allowedRoles])
    
    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    // Don't render if not authenticated
    if (!authUser) {
        return null
    }
    
    // Don't render if role not allowed
    if (!allowedRoles.includes(authUser.role)) {
        return null
    }
    
    return <>{children}</>
}

export default ProtectedRoute