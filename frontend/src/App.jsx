import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Jobs from './components/Jobs'
import Home from './components/Home'
import JobDescription from './components/JobDescription'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Profile from './components/Profile'
import PostJob from './components/PostedJobs'
import Companies from './components/Companies'
import CompanySetup from './components/CompanySetup'
import CompanyCreate from './components/CompanyCreate'
import Browse from './components/Browse'
import CreateJobs from './components/admin/CreateJobs'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Applicants from './components/admin/Applicants'
import AuthRoute from './components/auth/AuthRoute'
//import DevTools from './components/DevTools'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/login",
    element: <AuthRoute><Login /></AuthRoute>
  },
  {
    path: "/signup",
    element: <AuthRoute><Signup /></AuthRoute>
  },
  {
    path: "/profile",
    element: <ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>
  },
  // Admin Routes
  {
    path: "/admin/jobs",
    element: <ProtectedRoute allowedRoles={['recruiter']}><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute allowedRoles={['recruiter']}><CreateJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/edit",
    element: <ProtectedRoute allowedRoles={['recruiter']}><CreateJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute allowedRoles={['recruiter']}><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute allowedRoles={['recruiter']}><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute allowedRoles={['recruiter']}><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute allowedRoles={['recruiter']}><CompanySetup /></ProtectedRoute>
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <a href="/" className="text-blue-500 hover:underline">Go back to home</a>
      </div>
    </div>
  }
])

function App() {
  return (
    <div>
      
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App