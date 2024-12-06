import  { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';
import  UserController  from '../controllers/userController';
import { IUser } from '../utils/interface';
import upload from '../middleware/upload';
import { handlePayment } from '../controllers/paymentController';


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
router.get('/userdetails', authenticateToken, userController.userDetails);
router.get('/shopdetails/:id', authenticateToken, userController.shopDetails);

router.get('/shopPincode/:pincode', userController.getShopByPincode);
router.get('/shopsFilterByPincode/:pincode', userController.getShopsFilterByPincode);
router.get('/getModelByMake', userController.getModelByMakeVehicle);

router.put('/uploadprofileimage', authenticateToken, upload.single('image'), userController.uploadUserProfileImg);
router.put('/updateprofiledetails', authenticateToken, userController.updateUserProfileDetails);
router.put('/changepassword', authenticateToken, userController.updateUserProfilepassword);

router.post('/bookingConfirm', authenticateToken, userController.bookingConfirm );

export default router;

