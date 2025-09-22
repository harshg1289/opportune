import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadResumeToCloudinary = async (fileUri, originalName) => {
    try {
        const fileExtension = path.extname(originalName).toLowerCase();
        
        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type: "raw", // Use "raw" for all document types
            folder: "resumes",
            public_id: `resume_${Date.now()}${fileExtension}`,
            use_filename: false,
        });
        return result;
    } catch (error) {
        console.error('Cloudinary resume upload error:', error);
        throw error;
    }
};
// Alternative: Generate secure URLs for viewing
export const getSecureResumeUrl = (publicId, resourceType = "image", format = "pdf") => {
    try {
        return cloudinary.url(publicId, {
            resource_type: resourceType,
            format: format,
            flags: "attachment",
            secure: true
        });
    } catch (error) {
        console.error('Error generating secure URL:', error);
        return null;
    }
};

export default cloudinary;
