import { setAllAppliedJobs } from '@/redux/applicationSlice';
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.auth);

    useEffect(() => {
        // Only fetch if user is authenticated and is a student
        if (!authUser || authUser.role !== 'student') {
            return;
        }

        const fetchAppliedJobs = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get('http://localhost:8000/api/v1/application/get');
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application))
                }
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
                if (error.response?.status === 401) {
                    console.log('User not authenticated for applied jobs fetch');
                    dispatch(setAllAppliedJobs([]));
                }
            }
        }
        fetchAppliedJobs();
    }, [dispatch, authUser])
}

export default useGetAppliedJobs