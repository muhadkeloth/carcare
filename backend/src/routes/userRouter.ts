import express from 'express';
import { otpgenerate, otpvalidation, resetPassword, signup } from '../controllers/userController';

const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
router.post('/signup', async (req,res)=> {await signup(req,res)});
router.post('/otpgenerate', async (req,res)=> {await otpgenerate(req,res)});
router.post('/otpvalidation', async (req,res)=> {await otpvalidation(req,res)});
router.post('/resetPassword', async (req,res)=> {await resetPassword(req,res)});


export default router;

