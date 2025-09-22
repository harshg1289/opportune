import React from 'react'
import HeroSection from './HeroSection'
import { CategoryCarousel } from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import Navbar from './shared/Navbar'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Home = () => {
    useGetAllJobs(); // This should work for public access
    
    // NO AUTH REDIRECTS HERE - Home should be accessible to everyone
    return (
        <div>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
            <Footer />
        </div>
    )
}

export default Home