import  { Router } from 'express';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';
import  UserController  from '../controllers/userController';
import upload from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';


const router = Router();

const userService = new UserService(new UserRepository(User));
const userController = new UserController(userService);



router.post('/user/login', userController.login);
router.post('/signupOtpGenerate', userController.signupOtpGenerate);
router.post('/signup', userController.signup);
router.post('/otpgenerate', userController.otpgenerate);
router.post('/otpvalidation', userController.otpvalidation);
router.post('/resetPassword', userController.resetPassword);
router.post('/user/refreshToken', userController.refreshToken);

router.get('/randomfeedback', userController.randomFeedback);
router.get('/getshopsforHome', userController.getShopsforHome);

router.use(authenticateToken);

router.get('/getnearshops', userController.getNearShops);
router.get('/shopPincode/:pincode', userController.getShopByPincode);
router.get('/shopsFilterByPincode/:pincode', userController.getShopsFilterByPincode);
router.get('/getModelByMake', userController.getModelByMakeVehicle);


router.get('/userdetails',  userController.userDetails);
router.get('/shopdetails/:id',  userController.shopDetails);


router.put('/uploadprofileimage',  upload.single('image'), userController.uploadUserProfileImg);
router.put('/updateprofiledetails',  userController.updateUserProfileDetails);
router.put('/changepassword',  userController.updateUserProfilepassword);

router.post('/bookingConfirm',  userController.bookingConfirm );

router.get('/pickupsDetailsByUser',  userController.getUserPickups);
router.patch('/pickup/:id', userController.togglePickupStatus);

router.get('/bookingDetailsByUser',  userController.getUserBookings);
router.patch('/booking/:id', userController.toggleBookingStatus);

router.post('/estimateFinder', userController.estimateFinder);

router.patch('/feedback/:id', userController.updateFeedback);
router.get('/reviewsByShop/:id', userController.fetchShopReviews);

// chat
router.get('/createChatRoom/:shopId', userController.newChatRoomByUser);
router.get('/chatHistory', userController.fetchChatHistory);
router.get('/fetchMessages/:chatId', userController.fetchMessagesbyChatId);
router.post('/saveImageMessage', upload.single('image'), userController.saveImageMessage);
router.post('/saveMessage', userController.saveMessage);






export default router;

