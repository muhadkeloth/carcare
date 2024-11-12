import express from 'express';
import { addVehicleDetails, deleteVehicleDetails, EditVehicleDetails, 
    login, otpgenerate, otpvalidation, resetPassword, shopDetails, updateShopProfileDetails, updateShopProfilepassword, uploadShopProfileImg, vehicleDetails 
} from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/login', login);

router.post('/otpgenerate', otpgenerate);
router.post('/otpvalidation', otpvalidation);
router.post('/resetPassword', resetPassword);

router.get('/vehicledetails', authenticateToken,  vehicleDetails);
router.post('/addvehicle', authenticateToken,  addVehicleDetails);
router.put('/editvehicle/:id', authenticateToken,  EditVehicleDetails);
router.delete('/deletevehicle/:id', authenticateToken,  deleteVehicleDetails);

router.get('/shopdetails', authenticateToken, shopDetails)
router.put('/uploadprofileimage', authenticateToken, upload.single('image'),  uploadShopProfileImg)
router.put('/updateprofiledetails', authenticateToken, updateShopProfileDetails)
router.put('/changepassword', authenticateToken, updateShopProfilepassword)


export default router;