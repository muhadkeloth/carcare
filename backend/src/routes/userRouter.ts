import express, { NextFunction, Request, Response } from 'express';
import { otpgenerate, otpvalidation, resetPassword, signup, login, getNearShops, signupOtpGenerate, userDetails, shopDetails } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/user/login', login);
router.post('/signupOtpGenerate', signupOtpGenerate);
router.post('/signup', signup);
router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);

router.get('/getnearshops', getNearShops);
router.get('/userdetails', authenticateToken, userDetails);
router.get('/shopdetails/:id', authenticateToken, shopDetails);



export default router;

