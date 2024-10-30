import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';


export const signup = async (req:Request, res:Response) => {
    const { username, email, password } = req.body;
    
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'User already exists'});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({username, email, password: hashedPassword });
        await user.save();
        console.log('signup page')

        res.status(201).json({message:'User registered successfully'});
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Server error'});
    }
}