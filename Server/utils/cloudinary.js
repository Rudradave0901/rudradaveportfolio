import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return;
        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v12345/portfolio/image.webp
        const urlObj = new URL(cloudinaryUrl);
        const pathParts = urlObj.pathname.split('/');
        // The public ID includes the folder and filename (without extension)
        // Usually it's after "upload/" (which might be followed by version "vXXXX/")
        const uploadIndex = pathParts.findIndex(p => p === 'upload');
        if (uploadIndex === -1) return;
        
        let idStartIndex = uploadIndex + 1;
        // Skip version if present
        if (pathParts[idStartIndex].match(/^v\d+$/)) {
            idStartIndex++;
        }
        
        const publicIdWithExtension = pathParts.slice(idStartIndex).join('/');
        // Remove extension
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
        
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
};

export { cloudinary };
