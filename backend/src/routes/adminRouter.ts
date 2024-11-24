import { Router } from 'express';
import upload from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';
import AdminController from '../controllers/adminController';
import AdminService from '../services/AdminService';
import AdminRepository from '../repositories/AdminRepository';
import User from '../models/User';


const router = Router();

const adminService = new AdminService(new AdminRepository(User));
const adminController = new AdminController(adminService);


router.post('/login', adminController.login );

router.post('/otpgenerate', adminController.otpgenerate);
router.post('/otpvalidation', adminController.otpvalidation);
router.post('/resetPassword', adminController.resetPassword);

router.get('/users',authenticateToken, adminController.userDetails);
router.patch('/user/:id',authenticateToken, adminController.toggleStatus);

router.get('/shopdetails', authenticateToken, adminController.shopdetails);
router.post('/addShop',authenticateToken, upload.single('image'), adminController.addShop);
router.patch('/shopstatus/:id',authenticateToken, adminController.toggleShopStatus);


export default router;