import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Shop from "../models/Shop";
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../utils/interface";
import Vehicle from "../models/Vehicle";
import mongoose from "mongoose";


export const login = async (req:Request, res:Response, next:NextFunction) =>{
    const {email,password} = req.body;
    try{
        const shop = await Shop.findOne({email});
        if(!shop) throw new AppError("shop details not found",400);
        if(!shop) throw new AppError("shop details not found",400);
        if(!shop.isActive ) 
            throw new AppError("Account is blocked. Please contact customer care.",400);

        if(shop.password){
            const isPasswordValid = await bcrypt.compare(password,shop.password);
            if(!isPasswordValid) throw new AppError("Invalid password",400);
            
            const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
            const token = jwt.sign({id:shop._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})
            
            res.status(201).json({token, role:'shop', message:"shop Login successful"})
        }else{
            if(shop.otpExpiry && new Date() > shop.otpExpiry)
                throw new AppError("otp expired.generate another otp",400);

            if(shop.otp && shop.otp === password ){
                res.status(201).json({validotp:true,role:'shop',message:"otp verified.please proceed to change your password."})
            }else{
                throw new AppError("Invalid otp",400);
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
    if(!req.user) throw new AppError('error to find shopid',404);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;
    console.log('here in backend vehicle shop details fetch')
    try {
        const shopdetails = await Shop.findById(req.user);
        if(!shopdetails)throw new AppError('finding shop vehicle details error',404);

        const vehicleIds = shopdetails.vehicleIds;
        if(!vehicleIds || vehicleIds.length == 0 ){
            res.status(201).json({shopVehicle:[],totalPages:1,currentPage:page})
        }else{
            const vehicles = await Vehicle.find({_id:{$in:vehicleIds}}).skip(skip).limit(limit)
            console.log('vehicle details from backend');
            
            res.status(201).json({shopVehicle:vehicles,totalPages: Math.ceil(vehicles.length / limit), currentPage: page,})
        }

    } catch (error) {
        console.error('error fetching vehicle details in shop ',error);
        next(error);
    }
} 

export const addVehicleDetails = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(!req.user) throw new AppError('error to find shopid',404);
        const { brand, vehicleModel, year } = req.body;

        if(!brand || !vehicleModel || !year || !Array.isArray(year)){
            throw new AppError('Invalid vehicle details',400)
        }
        try {
            let vehicle = await Vehicle.findOne({brand,vehicleModel});
            if(!vehicle){
                vehicle = await Vehicle.create({brand,vehicleModel, year});
            }
            if(!vehicle)throw new AppError('failed to create or find vehicle ',500)

            const shopUser = await Shop.findById(req.user);
            if(!shopUser) throw new AppError('shop user not found',404);

             let vehicleId = vehicle._id as mongoose.Types.ObjectId;
            if (!shopUser.vehicleIds.some((id) => id.toString() === vehicleId.toString())) {
                shopUser.vehicleIds.push(vehicleId);
                await shopUser.save();
              }

            res.status(201).json({ message: 'Vehicle added successfully' });
        } catch (error) {
            console.error('Error adding vehicle details:', error);
            next(error);
        }
        
}


