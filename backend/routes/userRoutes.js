// Add this import at the top of your userRoutes.js file
import axios from 'axios';

// Add this new route to your userRoutes.js
router.route("/resume/view/:userId").get(async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find user and get resume URL
        const user = await User.findById(userId);
        if (!user || !user.profile?.resume) {
            return res.status(404).json({ 
                success: false, 
                message: 'Resume not found' 
            });
        }

        // Fetch the resume from Cloudinary
        const response = await axios({
            method: 'GET',
            url: user.profile.resume,
            responseType: 'stream',
            timeout: 10000
        });

        // Set proper headers for PDF viewing/downloading
        const fileName = user.profile.resumeOriginalName || 'resume.pdf';
        const isDownload = req.query.download === 'true';
        
        if (isDownload) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        } else {
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        
        // Stream the PDF to the response
        response.data.pipe(res);

    } catch (error) {
        console.error('Resume fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch resume' 
        });
    }
});

// Don't forget to import User model at the top:
// import { User } from "../models/user.model.js";