import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { LogOut, User2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setAuthUser } from "@/redux/authSlice"
import { persistor } from "@/redux/store" // Import persistor

export function ProfilePopover() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { authUser } = useSelector(store => store.auth)
    
    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", { 
                withCredentials: true 
            })
            
            if (res.data.success) {
                // Clear Redux state
                dispatch(setAuthUser(null))
                
                // Clear persisted storage
                await persistor.purge()
                
                // Clear localStorage manually as backup
                localStorage.clear()
                
                // Navigate to home
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error('Logout error:', error)
            
            // Force logout even if API call fails
            dispatch(setAuthUser(null))
            await persistor.purge()
            localStorage.clear()
            navigate("/")
            toast.success("Logged out successfully")
        }
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={authUser?.profile?.profilePhoto} alt="profile" />
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="flex gap-2 space-y-2">
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={authUser?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h4 className="font-medium leading-none">{authUser?.fullname}</h4>
                            {authUser && authUser?.role === 'student' && (
                                <p className="text-sm text-muted-foreground">
                                    {authUser?.profile?.bio || "No bio added"}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 text-gray-600">
                        {authUser && authUser?.role === 'student' && (
                            <Link to="/profile" className="flex w-fit items-center gap-2 cursor-pointer hover:text-gray-800">
                                <User2 />
                                <p>View Profile</p>
                            </Link>
                        )}
                        <div 
                            onClick={logoutHandler} 
                            className="flex w-fit items-center gap-2 cursor-pointer hover:text-gray-800"
                        >
                            <LogOut />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
