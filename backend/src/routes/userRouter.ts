import express, { NextFunction, Request, Response } from 'express';
import { otpgenerate, otpvalidation, resetPassword, signup, login, getNearShops, signupOtpGenerate, userDetails } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
// router.post('/user/login',async (req:Request, res:Response, next:NextFunction) => {await login(req,res,next)} );
// router.post('/signup', async (req:Request,res:Response, next:NextFunction)=> {await signup(req, res, next)});
// router.post('/otpgenerate', async (req:Request,res:Response, next:NextFunction)=> {await otpgenerate(req, res, next)});
// router.post('/otpvalidation', async (req:Request,res:Response, next:NextFunction)=> {await otpvalidation(req, res, next)});
// router.post('/resetPassword', async (req:Request,res:Response, next:NextFunction)=> {await resetPassword(req, res, next)});
router.post('/user/login', login);
router.post('/signupOtpGenerate', signupOtpGenerate);
router.post('/signup', signup);
router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);

// router.get('/getnearshops', async (req:Request,res:Response, next:NextFunction)=> {await getNearShops(req, res, next)});
router.get('/getnearshops', getNearShops);
router.get('/userdetails', authenticateToken, userDetails);



export default router;

