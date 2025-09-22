import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {singleUpload}  from "../middlewares/multer.js";
import { User } from "../models/user.model.js"; // Add this import
import axios from 'axios'; // Add this import

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put( isAuthenticated ,singleUpload,updateProfile);

router.get("/resume/view/:userId", async (req, res) => {
    try {
        console.log("=== Resume Route Debug ===");
        console.log("1. Route hit with userId:", req.params.userId);
        
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user || !user.profile?.resume) {
            return res.status(404).json({ 
                success: false, 
                message: 'Resume not found' 
            });
        }

        console.log("Found resume URL:", user.profile.resume);

        // Fix the Cloudinary URL if it has wrong resource type
        let resumeUrl = user.profile.resume;
        if (resumeUrl.includes('/image/upload/') && resumeUrl.endsWith('.pdf')) {
            // Convert from image to raw resource type for PDFs
            resumeUrl = resumeUrl.replace('/image/upload/', '/raw/upload/');
            console.log("Fixed resume URL:", resumeUrl);
        }

        const response = await axios({
            method: 'GET',
            url: resumeUrl,
            responseType: 'stream',
            timeout: 10000
        });

        const fileName = user.profile.resumeOriginalName || 'resume.pdf';
        const isDownload = req.query.download === 'true';
        
        if (isDownload) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        } else {
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        
        response.data.pipe(res);

    } catch (error) {
        console.error('Resume fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch resume',
            error: error.message
        });
    }
});
export default router;
