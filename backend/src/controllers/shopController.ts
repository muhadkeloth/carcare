import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Shop from "../models/Shop";


export const login = async (req:Request, res:Response)=>{
    const {email,password} = req.body;
    try{
        const shop = await Shop.findOne({email});
        if(!shop) return res.status(400).json({message:"shop details not found"});
        if(!shop.isActive ) 
            return res.status(400).json({message:"Account is blocked. Please contact customer care."});
        if(!shop.password){
            if(shop.otp && shop.otp === password ){
                return res.status(200).json({role:'shop',message:"otp verified.please proceed to change your password."})
            }else{
                return res.status(400).json({message:"Invalid otp"});
            }
        }

        const isPasswordValid = await bcrypt.compare(password,shop.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:shop._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})

        res.status(200).json({token, role:'shop', message:"shop Login successful"})
    }catch(error){
        console.error('Error during shop login:', error);
        res.status(500).json({message:"Server error shop login"});
    }
}

