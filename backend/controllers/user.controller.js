import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary, { uploadResumeToCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        let profilePhoto = "";

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exist with this email", success: false });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) return res.status(400).json({ message: "All fields are required", success: false });
        let user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Incorrect email or password" });
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: "Incorrect email or password" });

        // check role is correct or not 
        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role" })
        }
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; // set by isAuthenticated middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Update only the fields provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",").map(skill => skill.trim());

        // Handle file upload
        if (req.file) {
            const fileUri = getDataUri(req.file);
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            let cloudResponse;
            
            // Check if it's a resume (PDF/DOC) or profile photo (image)
            if (req.file.mimetype === 'application/pdf' || 
                req.file.mimetype === 'application/msword' || 
                req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                
                // Upload as resume using the specialized function
                cloudResponse = await uploadResumeToCloudinary(fileUri.content, req.file.originalname);
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = req.file.originalname;
                console.log('Resume uploaded successfully:', cloudResponse.secure_url);
                
            } else if (req.file.mimetype.startsWith('image/')) {
                // Upload as profile photo
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "profiles",
                    transformation: [
                        { width: 400, height: 400, crop: "fill" },
                        { quality: "auto" }
                    ]
                });
                user.profile.profilePhoto = cloudResponse.secure_url;
                console.log('Profile photo uploaded successfully:', cloudResponse.secure_url);
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ 
            message: "Server error", 
            success: false, 
            error: error.message 
        });
    }
};
