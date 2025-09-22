import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchText } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = () => {
    if (!query.trim()) return
    dispatch(setSearchText(query))
    navigate("/browse")
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f7ff] via-white to-[#f3e9ff] py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-block mb-6">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-[#6A38C2] shadow-sm">
             India’s #1 Job Hunting Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Find, Apply & <br />
          Land Your <span className="text-[#6A38C2]">Dream Job</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Thousands of companies are hiring right now. Discover opportunities
          tailored to your skills, connect with recruiters, and take the next
          big step in your career.
        </p>

        {/* Search bar */}
        <div className="flex w-full md:w-[60%] mx-auto shadow-xl border border-gray-200 rounded-full items-center overflow-hidden">
          <input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for jobs, roles, or companies..."
            className="px-4 py-3 outline-none border-none w-full text-gray-700"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-none rounded-r-full bg-[#6A38C2] px-6 py-3 hover:bg-[#542a99]"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Extra line */}
        <p className="text-sm text-gray-500 mt-4">
          💡 Tip: Try searching for <span className="font-medium">“Frontend Developer”</span> or <span className="font-medium">“Data Analyst”</span>
        </p>
      </div>
    </section>
  )
}

export default HeroSection
