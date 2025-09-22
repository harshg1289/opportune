import multer from "multer";

const storage = multer.memoryStorage();

// File filter to allow both images and documents
const fileFilter = (req, file, cb) => {
    console.log('File being uploaded:', file.originalname, file.mimetype);
    
    // Allow images for profile photos
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    // Allow documents for resumes
    else if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images, PDF, DOC, and DOCX files are allowed.'), false);
    }
};

export const singleUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single("file");