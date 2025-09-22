import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup } from '../ui/radio-group'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: ""
    })
    const [errors, setErrors] = useState({})
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
        // Clear specific field error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }
    
    const validateForm = () => {
        const newErrors = {}
        
        if (!input.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            newErrors.email = 'Email is invalid'
        }
        
        if (!input.password) {
            newErrors.password = 'Password is required'
        } else if (input.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        
        if (!input.role) {
            newErrors.role = 'Please select a role'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    const submitHandler = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        try {
            dispatch(setLoading(true))
            const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message)
                
                // Navigate based on user role
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies")
                } else if (res.data.user.role === 'student') {
                    navigate("/")
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Login failed. Please try again.'
            toast.error(errorMessage)
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-4'>Login</h1>
                    
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="john@gmail.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Password"
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    
                    <div className="my-5">
                        <RadioGroup className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    id="student"
                                />
                                <Label htmlFor="student">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    id="recruiter"
                                />
                                <Label htmlFor="recruiter">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                    
                    {
                        loading ? (
                            <Button className='w-full my-4' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className='w-full my-4'>Login</Button>
                        )
                    }
                    <span className='text-sm'>
                        Don't have an account? <Link to={"/signup"} className='text-blue-500 cursor-pointer underline'>Signup</Link>
                    </span>
                </form>
            </div>
        </>
    )
}

export default Login
