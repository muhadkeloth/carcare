import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import upload from '../middleware/upload';
import { ShopController } from '../controllers/shopController';
import ShopService from '../services/ShopService';
import ShopRepository from '../repositories/ShopRepository';
import Shop from '../models/Shop';


const router = Router();

const shopService = new ShopService(new ShopRepository(Shop));
const shopController = new ShopController(shopService);


router.post('/login', shopController.login);

router.post('/otpgenerate', shopController.otpgenerate);
router.post('/otpvalidation', shopController.otpvalidation);
router.post('/resetPassword', shopController.resetPassword);

router.get('/vehicledetails', authenticateToken, shopController.vehicleDetails);
router.post('/addvehicle', authenticateToken, shopController.addVehicleDetails);
router.put('/editvehicle/:id', authenticateToken, shopController.EditVehicleDetails);
router.delete('/deletevehicle/:id', authenticateToken, shopController.deleteVehicleDetails);

router.get('/shopdetails', authenticateToken, shopController.shopDetails);
router.put('/uploadprofileimage', authenticateToken, upload.single('image'), shopController.uploadShopProfileImg);
router.put('/updateprofiledetails', authenticateToken, shopController.updateShopProfileDetails);
router.put('/changepassword', authenticateToken, shopController.updateShopProfilepassword);


export default router;