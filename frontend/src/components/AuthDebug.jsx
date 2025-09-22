import React from 'react'
import { useSelector } from 'react-redux'

const AuthDebug = () => {
    const { authUser, loading } = useSelector(store => store.auth)
    
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return null
    
    return (
        <div className="fixed top-0 right-0 bg-red-100 p-2 text-xs border border-red-300 z-50 max-w-xs">
            <div><strong>Auth Debug:</strong></div>
            <div>Loading: {loading ? 'true' : 'false'}</div>
            <div>AuthUser: {authUser ? JSON.stringify({
                role: authUser.role,
                email: authUser.email,
                fullname: authUser.fullname
            }) : 'null'}</div>
        </div>
    )
}

export default AuthDebug