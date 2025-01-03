import { Router } from 'express';
import { authenticateToken, roleBasedAccess } from '../middleware/auth';
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
router.post('/refreshToken', shopController.refreshToken);

router.use(authenticateToken);
router.use(roleBasedAccess(['shop']));

router.get('/allvehicledetails', shopController.getAllvehicleDetails);
router.get('/vehicledetails', shopController.getvehicleDetails);
router.post('/addvehicle', shopController.addVehicleDetails);
router.put('/editvehicle', shopController.editVehicleDetails);
router.delete('/deletevehicle/:brand', shopController.deleteVehicleDetails);

router.get('/allEstimatedetails', shopController.getEstimateDetails);
router.post('/addestimate', shopController.createEstimate);
router.put('/editestimate', shopController.editEstimateDetails);
router.delete('/deleteestimate/:work', shopController.deleteEstimateDetails);

router.get('/shopdetails', shopController.shopDetails);
router.put('/uploadprofileimage', upload.single('image'), shopController.uploadShopProfileImg);
router.put('/updateprofiledetails', shopController.updateShopProfileDetails);
router.put('/updateprofileinfo', shopController.updateShopProfileInfo);
router.put('/updateprofileWorkTime', shopController.updateShopProfileWorkTime);
router.put('/changepassword', shopController.updateShopProfilepassword);

router.get('/pickupsDetailsByShopId', shopController.getShopPickups);
router.patch('/pickup/:id', shopController.togglePickupStatus);

router.get('/bookingDetailsByShopId', shopController.getShopBookings);
router.patch('/booking/:id', shopController.toggleBookingStatus);
router.get('/dashStatistics', shopController.dashStatistics);
router.get('/barChartFilter', shopController.barChartFilter);
router.get('/lineChartFilter', shopController.lineChartFilter);

router.get('/reviews', shopController.fetchShopReviews);

// chat
router.get('/createChatRoom/:userId', shopController.newChatRoomByUser);
router.get('/chatHistory', shopController.fetchChatHistory);
router.get('/fetchMessages/:chatId', shopController.fetchMessagesbyChatId);
router.post('/saveImageMessage',upload.single('image'), shopController.saveImageMessage);
router.post('/saveMessage', shopController.saveMessage);





export default router;