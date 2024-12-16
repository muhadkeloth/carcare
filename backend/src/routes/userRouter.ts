import  { Router } from 'express';
// import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';
import  UserController  from '../controllers/userController';
// import { IUser } from '../utils/interface';
import upload from '../middleware/upload';
// import { handlePayment } from '../controllers/paymentController';
import { authenticateTokenOfUser } from '../middleware/auth';


const router = Router();

const userService = new UserService(new UserRepository(User));
const userController = new UserController(userService);


router.post('/user/login', userController.login);
router.post('/signupOtpGenerate', userController.signupOtpGenerate);
router.post('/signup', userController.signup);
router.post('/otpgenerate', userController.otpgenerate);
router.post('/otpvalidation', userController.otpvalidation);
router.post('/resetPassword', userController.resetPassword);

router.get('/getnearshops', userController.getNearShops);
// router.get('/userdetails', authenticateToken, userController.userDetails);
router.get('/userdetails', authenticateTokenOfUser, userController.userDetails);
router.get('/shopdetails/:id', authenticateTokenOfUser, userController.shopDetails);

router.get('/shopPincode/:pincode', userController.getShopByPincode);
router.get('/shopsFilterByPincode/:pincode', userController.getShopsFilterByPincode);
router.get('/getModelByMake', userController.getModelByMakeVehicle);

router.put('/uploadprofileimage', authenticateTokenOfUser, upload.single('image'), userController.uploadUserProfileImg);
router.put('/updateprofiledetails', authenticateTokenOfUser, userController.updateUserProfileDetails);
router.put('/changepassword', authenticateTokenOfUser, userController.updateUserProfilepassword);

router.post('/bookingConfirm', authenticateTokenOfUser, userController.bookingConfirm );

router.get('/pickupsDetailsByUser', authenticateTokenOfUser, userController.getUserPickups);
router.patch('/pickup/:id',authenticateTokenOfUser, userController.togglePickupStatus);

router.get('/bookingDetailsByUser', authenticateTokenOfUser, userController.getUserBookings);
router.patch('/booking/:id',authenticateTokenOfUser, userController.toggleBookingStatus);

router.patch('/feedback/:id',authenticateTokenOfUser, userController.updateFeedback);
router.get('/reviewsByShop/:id',authenticateTokenOfUser, userController.fetchShopReviews);

// 
// router.get('/gpt', userController.gpt);




export default router;

