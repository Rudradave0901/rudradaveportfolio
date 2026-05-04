import sharp from 'sharp';
import path from 'path';
import { cloudinary } from './cloudinary.js';

export const optimizeImage = async (file, destination, options = {}) => {
    const {
        width = 800,
        quality = 80,
        format = 'webp'
    } = options;

    const buffer = await sharp(file.buffer)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality })
        .toBuffer();

    const folderName = path.basename(destination) || 'portfolio';

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Cloudinary upload failed: No result returned"));
                resolve({
                    fileName: result.public_id,
                    filePath: result.secure_url
                });
            }
        );
        uploadStream.end(buffer);
    });
};
