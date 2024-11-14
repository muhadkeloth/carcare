import express from 'express';
import { 
    addShop, login, otpgenerate, otpvalidation, resetPassword, 
    shopdetails, toggleShopStatus, toggleStatus, userDetails 
} from '../controllers/adminController';
import upload from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';


const router = express.Router();


router.post('/login', login );

router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);

router.get('/users',authenticateToken, userDetails);
router.patch('/user/:id',authenticateToken, toggleStatus);

router.get('/shopdetails', authenticateToken, shopdetails);
router.post('/addShop',authenticateToken, upload.single('image'), addShop);
router.patch('/shopstatus/:id',authenticateToken, toggleShopStatus);


export default router;