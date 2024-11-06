import express, { Request, Response } from 'express';
import { addShop, login, otpgenerate, otpvalidation, resetPassword, shopdetails, toggleStatus, userDetails } from '../controllers/adminController';
import upload from '../middleware/upload';


const router = express.Router();

// router.get('/', async (req,res)=> {await loginget(req,res)});
router.post('/login',async (req:Request,res:Response) => {await login(req,res)} );
router.get('/users', async (req:Request,res:Response)=> {await userDetails(req,res)});
router.patch('/user/:id', async (req:Request,res:Response)=> {await toggleStatus(req,res)});
router.get('/shopdetails', async (req:Request,res:Response)=> {await shopdetails(req,res)});
router.post('/addShop', upload.single('image'), async (req:Request,res:Response)=> {await addShop(req,res)});

router.post('/otpgenerate', async (req:Request,res:Response)=> {await otpgenerate(req,res)});
router.post('/otpvalidation', async (req:Request,res:Response)=> {await otpvalidation(req,res)});
router.post('/resetPassword', async (req:Request,res:Response)=> {await resetPassword(req,res)});


export default router;