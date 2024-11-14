import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Shop from "../models/Shop";
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";
import Vehicle from "../models/Vehicle";
import mongoose from "mongoose";


export const login = async (req:Request, res:Response, next:NextFunction) =>{
    const {email,password} = req.body;
    try{
        const shop = await Shop.findOne({email});
        if(!shop) throw new AppError("shop details not found",HttpStatusCode.BAD_REQUEST);
        if(!shop.isActive ) 
            throw new AppError("Account is blocked. Please contact customer care.",HttpStatusCode.FORBIDDEN);

        if(shop.password){
            const isPasswordValid = await bcrypt.compare(password,shop.password);
            if(!isPasswordValid) throw new AppError("Invalid password",HttpStatusCode.BAD_REQUEST);
            
            const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
            const token = jwt.sign({id:shop._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})
            
            res.status(HttpStatusCode.SUCCESS).json({token, role:'shop', message:"shop Login successful"})
        }else{
            if(shop.otpExpiry && new Date() > shop.otpExpiry)
                throw new AppError("otp expired.generate another otp",HttpStatusCode.BAD_REQUEST);

            if(shop.otp && shop.otp === password ){
                res.status(HttpStatusCode.SUCCESS).json({validotp:true,role:'shop',message:"otp verified.please proceed to change your password."})
            }else{
                throw new AppError("Invalid otp",HttpStatusCode.BAD_REQUEST);
            }
        }

        // if(!shop.password){
        //     if(shop.otpExpiry && new Date() > shop.otpExpiry)
        //         throw new AppError("otp expired.generate another otp",400);

        //     if(shop.otp && shop.otp === password ){
        //         return res.status(201).json({validotp:true,role:'shop',message:"otp verified.please proceed to change your password."})
        //     }else{
        //         throw new AppError("Invalid otp",400);
        //     }
        // }

        // const isPasswordValid = await bcrypt.compare(password,shop.password);
        // if(!isPasswordValid) throw new AppError("Invalid password",400);
        
        // const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        // const token = jwt.sign({id:shop._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})

        // res.status(201).json({token, role:'shop', message:"shop Login successful"})
    }catch(error){
        console.error('Error during shop login:', error);
        // res.status(500).json({message:"Server error shop login"});
        next(error)
    }
}

export const otpgenerate = async (req:Request,res:Response, next:NextFunction) => {
    const { email, role } = req.body;
    try {
        const response = await otpgenerateFn(email,role);
        res.status(response.status).json({message:response.message})
    } catch (error) {
        // res.status(500).json({message:"an error occured.please try again."})
        next(error)
    }
}

export const otpvalidation = async (req:Request,res:Response, next:NextFunction) => {
    const { otp, email ,role } = req.body;
    try{
        const response = await otpvalidationFn(email,otp,role)
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('otp error:',error);
        // res.status(500).json({message:'an error on otp validation'})
        next(error)
    }
}

export const resetPassword = async (req:Request,res:Response, next:NextFunction) => {
    const {email, password, role } = req.body;
    try {
        const response = await resetPasswordFn(email,password, role);
        res.status(response.status).json({token:response.token,message:response.message})
    } catch (error) {
        console.log('reset password error backend');
        // res.status(500).json({message:'error in resetpass'})
        next(error)
    }
}

export const vehicleDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(!req.user) throw new AppError('error to find shopid',HttpStatusCode.BAD_REQUEST);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;
    console.log('here in backend vehicle shop details fetch')
    try {
        const shopdetails = await Shop.findById(req.user);
        if(!shopdetails)throw new AppError('finding shop vehicle details error',HttpStatusCode.NOT_FOUND);

        const vehicleIds = shopdetails.vehicleIds;
        if(!vehicleIds || vehicleIds.length == 0 ){
            res.status(HttpStatusCode.SUCCESS).json({shopVehicle:[],totalPages:1,currentPage:page})
        }else{
            const vehicles = await Vehicle.find({_id:{$in:vehicleIds}}).sort({createdAt:-1}).skip(skip).limit(limit)
            console.log('vehicle details from backend');
            
            res.status(HttpStatusCode.SUCCESS).json({shopVehicle:vehicles,totalPages: Math.ceil(vehicles.length / limit), currentPage: page,})
        }

    } catch (error) {
        console.error('error fetching vehicle details in shop ',error);
        next(error);
    }
} 

export const addVehicleDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
    if(!req.user) throw new AppError('error to find shopid',HttpStatusCode.BAD_REQUEST);
    const { brand, vehicleModel, year } = req.body;

        if(!brand || !vehicleModel || !year || !Array.isArray(year)){
            throw new AppError('Invalid vehicle details',HttpStatusCode.BAD_REQUEST)
        }
            let vehicle = await Vehicle.findOne({brand,vehicleModel});
            if(!vehicle){
                vehicle = await Vehicle.create({brand,vehicleModel, year});
            }else{
                const newYears = year.filter((y) => !vehicle?.year.includes(y));
                if(newYears.length>0){
                    vehicle.year.push(...newYears);
                    await vehicle.save()
                }
            }
            if(!vehicle)throw new AppError('failed to create or find vehicle ',HttpStatusCode.INTERNAL_SERVER_ERROR)
                
            const shopUser = await Shop.findById(req.user);
            if(!shopUser) throw new AppError('shop user not found',HttpStatusCode.SUCCESS);
                
             let vehicleId = vehicle._id as mongoose.Types.ObjectId;
             if (shopUser.vehicleIds && !shopUser.vehicleIds.some((id) => id.toString() === vehicleId.toString())) {
                 shopUser.vehicleIds.push(vehicleId);
                 await shopUser.save();
                }
                
                res.status(HttpStatusCode.CREATED).json({ message: 'Vehicle added successfully' });
            } catch (error) {
                console.error('Error adding vehicle details:', error);
                next(error);
        }
    }
    
export const EditVehicleDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('Error: User not found or authenticated',HttpStatusCode.BAD_REQUEST);
        const vehicleId = req.params.id;
        if(!vehicleId) throw new AppError('vehicle id is required ',HttpStatusCode.BAD_REQUEST);
    
        const { brand, vehicleModel, year } = req.body;
        if(!brand || !vehicleModel || !year || !Array.isArray(year) || !year.every(item => typeof item === 'number') ){
            throw new AppError('Invalid vehicle details',HttpStatusCode.BAD_REQUEST)
        }
    
        const vehicleupload = await Vehicle.findById(vehicleId);
        if(!vehicleupload) throw new AppError('vehicle not found',HttpStatusCode.NOT_FOUND);

        vehicleupload.brand = brand;
        vehicleupload.vehicleModel = vehicleModel;
        vehicleupload.year = [1]
        vehicleupload.year.push(...year)
        vehicleupload.year.shift()

        const vehicle = await vehicleupload.save();

        res.status(HttpStatusCode.CREATED).json({vehicle,message:'update vehicle details successfully'})
        
    } catch (error) {
        console.error('Error updating vehicle details:', error);
        next(error);
    }
}

export const deleteVehicleDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('Error: User not found or authenticated',HttpStatusCode.BAD_REQUEST);
        const vehicleId = req.params.id;
        if(!vehicleId) throw new AppError('vehicle id is required for deletion ',HttpStatusCode.BAD_REQUEST);
        
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
        if(!vehicle) throw new AppError('vehicle not found',HttpStatusCode.NOT_FOUND);

        const shop = await Shop.findById(req.user);
        if(!shop) throw new AppError('shopid not found to delete vehicle',HttpStatusCode.NOT_FOUND);

        const vehicleIndex = shop?.vehicleIds ? shop?.vehicleIds.indexOf(new mongoose.Types.ObjectId(vehicleId)) : -1;
        if(vehicleIndex !== -1 && shop?.vehicleIds ){
            shop?.vehicleIds.splice(vehicleIndex,1);
            await shop.save();
        }

        res.status(HttpStatusCode.SUCCESS).json({message:'Vehicle deleted and updated successfully in the shop'})
        
    } catch (error) {
        console.error('Error delete vehicle details:', error);
        next(error);
    }
}


export const shopDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('Error: User not found or authenticated',HttpStatusCode.BAD_REQUEST);
        const shopUser = await Shop.findById(req.user).select('-password -otp -otpExpiry').lean();
        if(!shopUser) throw new AppError('shop user not found in backend',HttpStatusCode.NOT_FOUND);
        res.status(HttpStatusCode.SUCCESS).json({shopUser,message:"shop User find successfully"})
    } catch (error) {
        console.error('Error finding shopuser details:', error);
        next(error);
    }
}

export const uploadShopProfileImg = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.file) throw new AppError('upload shop image file not found',HttpStatusCode.BAD_REQUEST);
        const imagePath = req.file.path;
        res.status(HttpStatusCode.CREATED).json({imagePath,message:'image uploaded successfully'})
    } catch (error) {
        console.error('Error upload shop profile image:', error);
        next(error);
    }
}

export const updateShopProfileDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('update shop details shop id not found',HttpStatusCode.BAD_REQUEST);
        const {shopName, ownerName, phoneNumber, about, location, image } = req.body;
        
        const shop = await Shop.findByIdAndUpdate(req.user,
            {shopName, ownerName, phoneNumber, about, location, image},
            { new: true }
        );
        res.status(HttpStatusCode.CREATED).json({success:true, shop});
    } catch (error) {
        console.error('Error updating shop profile details:', error);
        next(error);
    }
}

export const updateShopProfilepassword = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('password change error, shop id not found',HttpStatusCode.BAD_REQUEST);
        const {currentPassword , newPassword} = req.body;

        const shopdetails = await Shop.findById(req.user);
        if(!shopdetails) throw new AppError('shop details not found ',HttpStatusCode.NOT_FOUND);
        if(shopdetails?.password){
            const isMatch = await bcrypt.compare(currentPassword,shopdetails?.password);
            if(!isMatch) throw new AppError('incorrect current password',HttpStatusCode.BAD_REQUEST);

            const hashedNewPassword = await bcrypt.hash(newPassword,10);

            shopdetails.password = hashedNewPassword;
            await shopdetails.save();

            res.status(HttpStatusCode.CREATED).json({success:true,message:"password updated successfully"});
        }else throw new AppError('password not found ',HttpStatusCode.NOT_FOUND)
        
    } catch (error) {
        console.error('Error updating shop profile password:', error);
        next(error);
    }
}

