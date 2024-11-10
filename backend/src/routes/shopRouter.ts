import express from 'express';
import { addVehicleDetails, login, otpgenerate, otpvalidation, resetPassword, vehicleDetails } from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';
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

router.get('/vehicledetails', authenticateToken,  vehicleDetails);//auth
router.post('/addvehicle', authenticateToken,  addVehicleDetails);//auth


export default router;