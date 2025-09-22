import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Contact, Mail, Pen, Eye, Download } from 'lucide-react'
import ApplicationTable from './ApplicationTable'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { UpdateProfileDialog } from './UpdateProfileDialog'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Label } from './ui/label'
import { toast } from 'sonner'

const Profile = () => {
    useGetAppliedJobs()
    const [open, setOpen] = useState(false)
    const { authUser } = useSelector(store => store.auth)

    // Handle resume viewing through backend proxy
    const handleResumeView = () => {
        if (authUser?._id) {
            const viewUrl = `http://localhost:8000/api/v1/user/resume/view/${authUser._id}`;
            window.open(viewUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast.error('Unable to view resume');
        }
    };

    // Handle resume download through backend proxy
    const handleResumeDownload = () => {
        if (authUser?._id) {
            const downloadUrl = `http://localhost:8000/api/v1/user/resume/view/${authUser._id}?download=true`;
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('Resume download started');
        } else {
            toast.error('Unable to download resume');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={authUser?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{authUser?.fullname}</h1>
                            <p>{authUser?.profile?.bio || 'Add your bio here'}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className='text-right' variant='outline'>
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail className='h-4 w-4' />
                        <span>{authUser?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact className='h-4 w-4' />
                        <span>{authUser?.phoneNumber}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <h1 className='my-2 font-bold'>Skills</h1>
                    <div className='flex items-center gap-1 flex-wrap'>
                        {
                            authUser?.profile?.skills?.length > 0 
                                ? authUser.profile.skills.map((skill, index) => (
                                    <Badge key={index}>{skill}</Badge>
                                  ))
                                : <span>No skills added</span>
                        }
                    </div>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        authUser?.profile?.resume 
                            ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 flex-1">
                                        {authUser.profile.resumeOriginalName || 'resume.pdf'}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResumeView}
                                        className="flex items-center gap-1"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResumeDownload}
                                        className="flex items-center gap-1"
                                    >
                                        <Download className="h-3 w-3" />
                                        Download
                                    </Button>
                                </div>
                              ) 
                            : <span>No resume uploaded</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='text-xl font-bold p-5'>Applied Jobs</h1>
                <ApplicationTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile