import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req,file) =>({
        folder: "uploads",
        allowed_formats:["jpeg","png","jpg","webp"]
    }),
})

const upload = multer({
    storage,
    limits:{ fileSize: 5 * 1024 * 1024 },
});

export default upload;

