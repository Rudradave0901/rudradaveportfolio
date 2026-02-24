import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const optimizeImage = async (file, destination, options = {}) => {
    const {
        width = 800,
        quality = 80,
        format = 'webp'
    } = options;

    const fileName = `${Date.now()}-${path.parse(file.originalname).name}.${format}`;
    const filePath = path.join(destination, fileName);

    // Ensure directory exists
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    await sharp(file.buffer)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality })
        .toFile(filePath);

    return {
        fileName,
        filePath: `/uploads/${path.basename(destination)}/${fileName}`
    };
};
