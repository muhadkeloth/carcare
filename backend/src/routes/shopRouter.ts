import express, { Request, Response } from 'express';
import { login, otpgenerate, otpvalidation, resetPassword } from '../controllers/shopController';
// import { login } from '../controllers/loginController';

const router = express.Router();

router.post('/login', async (req:Request,res:Response)=> {await login(req,res) });
// router.get('/', async (req,res)=> {await loginget(req,res)});
// router.post('/', async (req,res)=> {await login(req,res)});

router.post('/otpgenerate', async (req:Request,res:Response)=> {await otpgenerate(req,res)});
router.post('/otpvalidation', async (req:Request,res:Response)=> {await otpvalidation(req,res)});
router.post('/resetPassword', async (req:Request,res:Response)=> {await resetPassword(req,res)});


export default router;