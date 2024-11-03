import express, { Request, Response } from 'express';
import { otpgenerate, otpvalidation, resetPassword, signup, login } from '../controllers/userController';

const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
router.post('/user/login',async (req:Request,res:Response) => {await login(req,res)} );
router.post('/signup', async (req:Request,res:Response)=> {await signup(req,res)});
router.post('/otpgenerate', async (req:Request,res:Response)=> {await otpgenerate(req,res)});
router.post('/otpvalidation', async (req:Request,res:Response)=> {await otpvalidation(req,res)});
router.post('/resetPassword', async (req:Request,res:Response)=> {await resetPassword(req,res)});


export default router;

