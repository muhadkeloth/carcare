import { Router } from 'express';
import upload from '../middleware/upload';
// import { authenticateToken } from '../middleware/auth';
import AdminController from '../controllers/adminController';
import AdminService from '../services/AdminService';
import AdminRepository from '../repositories/AdminRepository';
import User from '../models/User';
import { authenticateToken, roleBasedAccess } from '../middleware/auth';


const router = Router();

const adminService = new AdminService(new AdminRepository(User));
const adminController = new AdminController(adminService);


router.post('/login', adminController.login );

router.post('/otpgenerate', adminController.otpgenerate);
router.post('/otpvalidation', adminController.otpvalidation);
router.post('/resetPassword', adminController.resetPassword);


router.use(authenticateToken);
router.use(roleBasedAccess(['admin']));

// router.get('/users',authenticateTokenOfAdmin, adminController.userDetails);
router.get('/users', adminController.userDetails);
router.patch('/user/:id', adminController.toggleStatus);

router.get('/shopdetails', adminController.shopdetails);
router.post('/addShop', upload.single('image'), adminController.addShop);
router.patch('/shopstatus/:id', adminController.toggleShopStatus);

router.get('/vehicledetails', adminController.getvehicleDetails);
router.post('/addvehicle', adminController.addVehicleDetails);
router.put('/editvehicle', adminController.editVehicleDetails);
router.delete('/deletevehicle/:brand', adminController.deleteVehicleDetails);

router.get('/dashStatistics', adminController.dashStatistics);
router.get('/barChartFilter', adminController.barChartFilter);
router.get('/lineChartFilter', adminController.lineChartFilter);

router.get('/brokerageDetails/:action', adminController.brokeragedetails);


export default router;