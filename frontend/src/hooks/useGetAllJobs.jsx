import { setAllJobs } from "@/redux/jobSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllJobs = () => {
    const dispatch = useDispatch()
    const { searchText } = useSelector(store => store.job)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Don't require authentication for public job listings
                const res = await axios.get(`http://localhost:8000/api/v1/job/all?keyword=${searchText || ''}`, {
                    withCredentials: true, // Still send credentials if available
                    validateStatus: (status) => status < 500 // Accept 4xx errors
                })
               
                if (res.data?.success) {
                    dispatch(setAllJobs(res.data.jobs))
                } else if (res.status === 401) {
                    // For public pages, still show jobs even if not authenticated
                    dispatch(setAllJobs([]))
                }
            } catch (error) {
                console.log('Jobs fetch error (non-critical):', error.response?.status)
                // Don't block the UI for job fetch errors
                dispatch(setAllJobs([]))
            }
        }
        fetchJobs()
    }, [dispatch, searchText])
}

export default useGetAllJobs