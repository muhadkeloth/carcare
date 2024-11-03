import express, { Request, Response } from 'express';
import { login } from '../controllers/shopController';
// import { login } from '../controllers/loginController';

const router = express.Router();

router.post('/login', async (req:Request,res:Response)=> {await login(req,res) });
// router.get('/', async (req,res)=> {await loginget(req,res)});
// router.post('/', async (req,res)=> {await login(req,res)});


export default router;