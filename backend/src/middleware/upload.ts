import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        // const folder = req.body.folder; // Expects 'folder' in the request body
        // let uploadPath = 'public/uploads/';

        // // Customize based on folder type
        // if (folder === 'shopimg') {
        //     uploadPath += 'shopimg';
        // } else if (folder === 'profileimg') {
        //     uploadPath += 'profileimg';
        // } else {
        //     uploadPath += 'other'; // Default folder or handle other cases
        // }
        cb(null,'public/uploads/');
    },
    filename:(req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits:{ fileSize: 5 * 1024 * 1024 },
});

export default upload;