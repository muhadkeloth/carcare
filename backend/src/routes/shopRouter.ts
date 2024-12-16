import { Router } from 'express';
// import { authenticateToken } from '../middleware/auth';
import { authenticateTokenOfShop } from '../middleware/auth';
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

// router.get('/allvehicledetails', authenticateToken, shopController.getAllvehicleDetails);
router.get('/allvehicledetails', authenticateTokenOfShop, shopController.getAllvehicleDetails);
router.get('/vehicledetails', authenticateTokenOfShop, shopController.getvehicleDetails);
router.post('/addvehicle', authenticateTokenOfShop, shopController.addVehicleDetails);
router.put('/editvehicle', authenticateTokenOfShop, shopController.editVehicleDetails);
router.delete('/deletevehicle/:brand', authenticateTokenOfShop, shopController.deleteVehicleDetails);

router.get('/allEstimatedetails', authenticateTokenOfShop, shopController.getEstimateDetails);
router.post('/addestimate', authenticateTokenOfShop, shopController.createEstimate);
router.put('/editestimate', authenticateTokenOfShop, shopController.editEstimateDetails);
router.delete('/deleteestimate/:work', authenticateTokenOfShop, shopController.deleteEstimateDetails);

router.get('/shopdetails', authenticateTokenOfShop, shopController.shopDetails);
router.put('/uploadprofileimage', authenticateTokenOfShop, upload.single('image'), shopController.uploadShopProfileImg);
router.put('/updateprofiledetails', authenticateTokenOfShop, shopController.updateShopProfileDetails);
router.put('/updateprofileinfo', authenticateTokenOfShop, shopController.updateShopProfileInfo);
router.put('/updateprofileWorkTime', authenticateTokenOfShop, shopController.updateShopProfileWorkTime);
router.put('/changepassword', authenticateTokenOfShop, shopController.updateShopProfilepassword);

router.get('/pickupsDetailsByShopId', authenticateTokenOfShop, shopController.getShopPickups);
router.patch('/pickup/:id',authenticateTokenOfShop, shopController.togglePickupStatus);

router.get('/bookingDetailsByShopId', authenticateTokenOfShop, shopController.getShopBookings);
router.patch('/booking/:id',authenticateTokenOfShop, shopController.toggleBookingStatus);
router.get('/dashStatistics',authenticateTokenOfShop, shopController.dashStatistics);
router.get('/barChartFilter',authenticateTokenOfShop, shopController.barChartFilter);
router.get('/lineChartFilter',authenticateTokenOfShop, shopController.lineChartFilter);







export default router;