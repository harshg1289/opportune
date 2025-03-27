// // frontend/src/pages/About.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// function About() {
//     return (
//         <div className="container mx-auto p-4">
//             <div className="max-w-4xl mx-auto">
//                 <h1 className="text-3xl font-bold mb-6">About Opportune</h1>
                
//                 <section className="mb-12">
//                     <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
//                     <p className="text-gray-700 mb-4">
//                         At Opportune, our mission is to connect talented individuals with meaningful career opportunities. 
//                         We believe that finding the right job is about more than just matching skills to requirements—it's 
//                         about finding a place where you can grow, contribute, and thrive.
//                     </p>
//                     <p className="text-gray-700">
//                         We're committed to creating a platform that makes the job search process more efficient, 
//                         transparent, and accessible for everyone, while helping employers find the perfect candidates 
//                         for their teams.
//                     </p>
//                 </section>
                
//                 <section className="mb-12">
//                     <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
//                     <p className="text-gray-700 mb-4">
//                         Opportune was founded in 2022 by a team of professionals who experienced firsthand the challenges 
//                         of both job searching and hiring. Frustrated by outdated platforms and processes, they set out to 
//                         create a modern job portal that addresses the needs of both job seekers and employers.
//                     </p>
//                     <p className="text-gray-700">
//                         Since our launch, we've helped thousands of people find jobs they love and assisted hundreds of 
//                         companies in building strong, diverse teams. We continue to innovate and improve our platform 
//                         based on user feedback and industry trends.
//                     </p>
//                 </section>
                
//                 <section className="mb-12">
//                     <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {[
//                             {
//                                 name: "Alex Chen",
//                                 title: "CEO & Co-Founder",
//                                 image: "/assets/images/team-1.jpg",
//                                 bio: "Former HR executive with 15+ years of experience in talent acquisition."
//                             },
//                             {
//                                 name: "Sarah Johnson",
//                                 title: "CTO & Co-Founder",
//                                 image: "/assets/images/team-2.jpg",
//                                 bio: "Software engineer with a passion for creating intuitive user experiences."
//                             },
//                             {
//                                 name: "Michael Rodriguez",
//                                 title: "Chief Product Officer",
//                                 image: "/assets/images/team-3.jpg",
//                                 bio: "Product specialist focused on developing innovative recruitment solutions."
//                             },
//                         ].map((member, index) => (
//                             <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
//                                 <img 
//                                     src={member.image} 
//                                     alt={member.name} 
//                                     className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                                 />
//                                 <h3 className="text-xl font-semibold">{member.name}</h3>
//                                 <p className="text-blue-600 mb-2">{member.title}</p>
//                                 <p className="text-gray-700">{member.bio}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
                
//                 <section className="mb-12">
//                     <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {[
//                             {
//                                 title: "Transparency",
//                                 description: "We believe in providing clear, honest information to both job seekers and employers."
//                             },
//                             {
//                                 title: "Inclusivity",
//                                 description: "We're committed to creating equal opportunities for people from all backgrounds."
//                             },
//                             {
//                                 title: "Innovation",
//                                 description: "We continuously improve our platform to meet the evolving needs of the job market."
//                             },
//                             {
//                                 title: "Quality",
//                                 description: "We focus on connecting the right people with the right opportunities, not just generating volume."
//                             },
//                         ].map((value, index) => (
//                             <div key={index} className="bg-gray-50 rounded-lg p-6">
//                                 <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
//                                 <p className="text-gray-700">{value.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
                
//                 <section>
//                     <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
//                     <p className="text-gray-700 mb-6">
//                         Whether you're looking for your next career move or seeking to build your team, 
//                         Opportune is here to help you succeed. Join our community today and discover 
//                         the power of meaningful connections.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <Link 
//                             to="/register" 
//                             className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
//                         >
//                             Create an Account
//                         </Link>
//                         <Link 
//                             to="/contact" 
//                             className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors duration-300 text-center"
//                         >
//                             Contact Us
//                         </Link>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

// export default About;



// frontend/src/pages/About.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function About() {
    const { user, company, isAuthenticated } = useContext(AuthContext);
    
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">About Opportune</h1>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-gray-700 mb-4">
                        At Opportune, our mission is to connect talented individuals with meaningful career opportunities. 
                        We believe that finding the right job is about more than just matching skills to requirements—it's 
                        about finding a place where you can grow, contribute, and thrive.
                    </p>
                    <p className="text-gray-700">
                        We're committed to creating a platform that makes the job search process more efficient, 
                        transparent, and accessible for everyone, while helping employers find the perfect candidates 
                        for their teams.
                    </p>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-gray-700 mb-4">
                        Opportune was founded in 2022 by a team of professionals who experienced firsthand the challenges 
                        of both job searching and hiring. Frustrated by outdated platforms and processes, they set out to 
                        create a modern job portal that addresses the needs of both job seekers and employers.
                    </p>
                    <p className="text-gray-700">
                        Since our launch, we've helped thousands of people find jobs they love and assisted hundreds of 
                        companies in building strong, diverse teams. We continue to innovate and improve our platform 
                        based on user feedback and industry trends.
                    </p>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Alex Chen",
                                title: "CEO & Co-Founder",
                                image: "/assets/images/team-1.jpg",
                                bio: "Former HR executive with 15+ years of experience in talent acquisition."
                            },
                            {
                                name: "Sarah Johnson",
                                title: "CTO & Co-Founder",
                                image: "/assets/images/team-2.jpg",
                                bio: "Software engineer with a passion for creating intuitive user experiences."
                            },
                            {
                                name: "Michael Rodriguez",
                                title: "Chief Product Officer",
                                image: "/assets/images/team-3.jpg",
                                bio: "Product specialist focused on developing innovative recruitment solutions."
                            },
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold">{member.name}</h3>
                                <p className="text-blue-600 mb-2">{member.title}</p>
                                <p className="text-gray-700">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Transparency",
                                description: "We believe in providing clear, honest information to both job seekers and employers."
                            },
                            {
                                title: "Inclusivity",
                                description: "We're committed to creating equal opportunities for people from all backgrounds."
                            },
                            {
                                title: "Innovation",
                                description: "We continuously improve our platform to meet the evolving needs of the job market."
                            },
                            {
                                title: "Quality",
                                description: "We focus on connecting the right people with the right opportunities, not just generating volume."
                            },
                        ].map((value, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-700">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
                    <p className="text-gray-700 mb-6">
                        Whether you're looking for your next career move or seeking to build your team, 
                        Opportune is here to help you succeed. Join our community today and discover 
                        the power of meaningful connections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Only show Create Account button to non-authenticated users */}
                        {!isAuthenticated ? (
                            <Link 
                                to="/register" 
                                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
                            >
                                Create an Account
                            </Link>
                        ) : (
                            user && !user.isAdmin && !company && (
                                <Link 
                                    to="/jobs" 
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
                                >
                                    Find Jobs
                                </Link>
                            )
                        )}
                        <Link 
                            to="/contact" 
                            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors duration-300 text-center"
                        >
                            Contact Us
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default About;

