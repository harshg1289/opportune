import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
    const { authUser } = useSelector(store => store.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (authUser) {
            if (authUser.role === 'recruiter') {
                navigate('/admin/companies')
            } else if (authUser.role === 'student') {
                navigate('/')
            }
        }
    }, [authUser, navigate])

    if (authUser) {
        return null
    }

    return <>{children}</>
}

export default AuthRoute