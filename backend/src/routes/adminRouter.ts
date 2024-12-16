import { Router } from 'express';
import upload from '../middleware/upload';
// import { authenticateToken } from '../middleware/auth';
import AdminController from '../controllers/adminController';
import AdminService from '../services/AdminService';
import AdminRepository from '../repositories/AdminRepository';
import User from '../models/User';
import { authenticateTokenOfAdmin } from '../middleware/auth';


const router = Router();

const adminService = new AdminService(new AdminRepository(User));
const adminController = new AdminController(adminService);


router.post('/login', adminController.login );

router.post('/otpgenerate', adminController.otpgenerate);
router.post('/otpvalidation', adminController.otpvalidation);
router.post('/resetPassword', adminController.resetPassword);

// router.get('/users',authenticateToken, adminController.userDetails);
router.get('/users',authenticateTokenOfAdmin, adminController.userDetails);
router.patch('/user/:id',authenticateTokenOfAdmin, adminController.toggleStatus);

router.get('/shopdetails', authenticateTokenOfAdmin, adminController.shopdetails);
router.post('/addShop',authenticateTokenOfAdmin, upload.single('image'), adminController.addShop);
router.patch('/shopstatus/:id',authenticateTokenOfAdmin, adminController.toggleShopStatus);

router.get('/vehicledetails', authenticateTokenOfAdmin, adminController.getvehicleDetails);
router.post('/addvehicle', authenticateTokenOfAdmin, adminController.addVehicleDetails);
router.put('/editvehicle', authenticateTokenOfAdmin, adminController.editVehicleDetails);
router.delete('/deletevehicle/:brand', authenticateTokenOfAdmin, adminController.deleteVehicleDetails);

router.get('/dashStatistics',authenticateTokenOfAdmin, adminController.dashStatistics);
router.get('/barChartFilter',authenticateTokenOfAdmin, adminController.barChartFilter);
router.get('/lineChartFilter',authenticateTokenOfAdmin, adminController.lineChartFilter);


export default router;