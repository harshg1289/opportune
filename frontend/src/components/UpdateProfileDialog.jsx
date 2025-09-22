import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setAuthUser, setLoading } from "@/redux/authSlice"
import axios from "axios"
import { Loader2, Download, Eye } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

export function UpdateProfileDialog({ open, setOpen }) {
    const { authUser, loading } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        fullname: authUser?.fullname || "",
        email: authUser?.email || "",
        phoneNumber: authUser?.phoneNumber || "",
        bio: authUser?.profile?.bio || "",
        skills: authUser?.profile?.skills?.join(", ") || "",
        file: null,
    });
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        console.log('File selected:', file);
        setInput({ ...input, file });
    }

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

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append('skills', input.skills);
        
        if (input.file) {
            formData.append('file', input.file);
            console.log('File added to FormData:', input.file.name, input.file.type);
        }

        try {
            dispatch(setLoading(true));
            
            const res = await axios.put("http://localhost:8000/api/v1/user/profile/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={input.email}
                                name="email"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="number" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="number"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                value={input.bio}
                                name="bio"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="Tell us about yourself"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right">
                                Skills
                            </Label>
                            <Input
                                id="skills"
                                value={input.skills}
                                name="skills"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file" className="text-right">
                                Resume
                            </Label>
                            <Input
                                id="file"
                                type="file"
                                name="file"
                                accept=".pdf,.doc,.docx"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>
                        {authUser?.profile?.resume && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Current Resume</Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="text-sm text-gray-600 flex-1">
                                        {authUser.profile.resumeOriginalName || 'resume.pdf'}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResumeView}
                                        className="flex items-center gap-1"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResumeDownload}
                                        className="flex items-center gap-1"
                                    >
                                        <Download className="h-3 w-3" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {
                            loading ? (
                                <Button disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit">Update</Button>
                            )
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}