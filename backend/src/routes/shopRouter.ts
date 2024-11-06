import express, { NextFunction, Request, Response } from 'express';
import { login, otpgenerate, otpvalidation, resetPassword } from '../controllers/shopController';
// import { login } from '../controllers/loginController';

const router = express.Router();

// router.post('/login', async (req:Request,res:Response,next:NextFunction)=> {await login(req,res,next) });
router.post('/login', login);

// router.post('/otpgenerate', async (req:Request,res:Response,next:NextFunction)=> {await otpgenerate(req,res,next)});
// router.post('/otpvalidation', async (req:Request,res:Response,next:NextFunction)=> {await otpvalidation(req,res,next)});
// router.post('/resetPassword', async (req:Request,res:Response,next:NextFunction)=> {await resetPassword(req,res,next)});
router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);


export default router;