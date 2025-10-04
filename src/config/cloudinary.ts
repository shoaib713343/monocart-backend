import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import 'dotenv/config';
import multer from 'multer';

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'monocart_products',
        allowed_formats: ['jpg', 'png', 'jpeg']
    } as {folder: string; allowed_formats: string[]},
})

export const upload = multer({storage: storage});