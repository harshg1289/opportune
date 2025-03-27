// frontend/src/pages/Jobs.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import JobList from '../components/JobList';

function Jobs() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    // Get the category directly from URL params
    const categoryFromURL = searchParams.get('category');
    
    // Debug what we're getting from the URL
    useEffect(() => {
        console.log("URL PARAMS DEBUG:");
        console.log("- Raw location.search:", location.search);
        console.log("- Category param:", categoryFromURL);
    }, [location.search, categoryFromURL]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                {categoryFromURL ? `${categoryFromURL} Jobs` : 'Find Your Perfect Job'}
            </h1>
            
            {/* Pass category directly to JobList */}
            <JobList categoryFilter={categoryFromURL} />
        </div>
    );
}

export default Jobs;