import { Request, Response } from "express";
import User from "../models/User";
import Shop from "../models/Shop";
import { randomPassword } from "../utils/functions";
import { sendOtpEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";


export const login = async (req:Request,res:Response) => {
    console.log('admin login')
    const {email,password} = req.body;
    try{
        const admin = await User.findOne({email,role:'admin'});
        if(!admin) return res.status(400).json({message:"email not found"});
        // if(!admin.isActive ) 
            // return res.status(400).json({message:"Account is blocked. Please contact customer care."});
        
        const isPasswordValid = await bcrypt.compare(password,admin.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:admin._id,role:'admin'}, JWT_SALT , {expiresIn:"1D"})

        res.status(201).json({token,role:'admin', message:"Login successful"})
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}

export const otpgenerate = async (req:Request,res:Response) => {
    const { email, role } = req.body;
    try {
        const response = await otpgenerateFn(email, role);
        res.status(response.status).json({message:response.message})
    } catch (error) {
        res.status(500).json({message:"an error occured.please try again."})
    }
}

export const otpvalidation = async (req:Request,res:Response) => {
    const { otp, email ,role } = req.body;
    try{
        const response = await otpvalidationFn(email,otp,role)
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('otp error:',error);
        res.status(500).json({message:'an error on otp validation'})
    }
}

export const resetPassword = async (req:Request,res:Response) => {
    const {email,password, role} = req.body;
    try{
        const response = await resetPasswordFn(email, password, role);
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('reset password error backend')
        res.status(500).json({message:'errorin resetpasss'})
    }  
}

export const userDetails = async (req:Request,res:Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;
    console.log('page admin')
    try{
        const users = await User.find({role:"user"}).sort({createdAt:-1}).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments({role:'user'});
        console.log(users)
        res.status(201).json({users,totalPages:Math.ceil(totalUsers/limit),currentPage:page});
    }catch(error){
        res.status(500).json({message:'failed to fetch users',error})
    }
}

export const toggleStatus = async (req:Request, res:Response) => {
    const { id } = req.params;
    try{
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message:'User not found'});

        user.isActive = user.isActive ? false : true ;
        await user.save();
        return res.status(200).json(user)
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Error updating status'})
    }
}

export const addShop = async (req:Request,res:Response) => {
    try {
        const { shopName, ownerName, email, phoneNumber, address, location } = req.body;
        const parseAddress = JSON.parse(address);
        const parsedLocation  = JSON.parse(location);
        const otp = randomPassword(8);
        await sendOtpEmail(email,otp);

        const newShop = new Shop({
            shopName,
            ownerName,
            email,
            phoneNumber,
            address:parseAddress,
            otp,
            otpExpiry:new Date(Date.now() + 5 * 60 * 1000),               
            location:{
                type:"Point",
                coordinates:[parsedLocation.longitude,parsedLocation.latitude],
            },
            image:req.file ? req.file.path :null,
        });
        const updatedShop = await newShop.save()
        console.log('updatedshop',updatedShop)
        res.status(201).json({message:"shop added successfully",shop:newShop})
    } catch (error) {
        console.log(error)
        res.status(404).json({message:'failed to add shop'})
    }
}

export const shopdetails = async (req:Request,res:Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;

    try{
        const workShop = await Shop.find().sort({createdAt:-1}).skip(skip).limit(limit);
        const totalWorkShop = await Shop.countDocuments();
        console.log('workshop',workShop)
        res.status(201).json({workShop,totalPages:Math.ceil(totalWorkShop/limit),currentPage:page})
    }catch(error){
        res.status(500).json({message:'failed to fetch workShop details',error})
    }
}