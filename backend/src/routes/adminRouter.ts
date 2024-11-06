import express, { NextFunction, Request, Response } from 'express';
import { addShop, login, otpgenerate, otpvalidation, resetPassword, shopdetails, toggleStatus, userDetails } from '../controllers/adminController';
import upload from '../middleware/upload';


const router = express.Router();


// router.post('/login',async (req:Request,res:Response,next:NextFunction) => {await login(req,res,next)} );
// router.get('/users', async (req:Request,res:Response,next:NextFunction)=> {await userDetails(req,res,next)});
// router.patch('/user/:id', async (req:Request,res:Response,next:NextFunction)=> {await toggleStatus(req,res,next)});
// router.get('/shopdetails', async (req:Request,res:Response,next:NextFunction)=> {await shopdetails(req,res,next)});
// router.post('/addShop', upload.single('image'), async (req:Request,res:Response,next:NextFunction)=> {await addShop(req,res,next)});

router.post('/login', login );
router.get('/users', userDetails);
router.patch('/user/:id', toggleStatus);
router.get('/shopdetails', shopdetails);
router.post('/addShop', upload.single('image'), addShop);

router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);


export default router;