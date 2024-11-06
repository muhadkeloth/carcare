import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Shop from "../models/Shop";
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";


export const login = async (req:Request, res:Response)=>{
    const {email,password} = req.body;
    try{
        const shop = await Shop.findOne({email});
        if(!shop) return res.status(400).json({message:"shop details not found"});
        if(!shop.isActive ) 
            return res.status(400).json({message:"Account is blocked. Please contact customer care."});
        if(!shop.password){
            if(shop.otpExpiry && new Date() > shop.otpExpiry)
                return res.status(400).json({message:"otp expired.generate another otp"});

            if(shop.otp && shop.otp === password ){
                return res.status(201).json({validotp:true,role:'shop',message:"otp verified.please proceed to change your password."})
            }else{
                return res.status(400).json({message:"Invalid otp"});
            }
        }

        const isPasswordValid = await bcrypt.compare(password,shop.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:shop._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})

        res.status(201).json({token, role:'shop', message:"shop Login successful"})
    }catch(error){
        console.error('Error during shop login:', error);
        res.status(500).json({message:"Server error shop login"});
    }
}

export const otpgenerate = async (req:Request,res:Response) => {
    const { email, role } = req.body;
    try {
        const response = await otpgenerateFn(email,role);
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
    const {email, password, role } = req.body;
    try {
        const response = await resetPasswordFn(email,password, role);
        res.status(response.status).json({message:response.message})
    } catch (error) {
        console.log('reset password error backend');
        res.status(500).json({message:'error in resetpass'})
    }
}



