import { Request, Response } from "express";
import User from "../models/User";



export const userDetails = async (req:Request,res:Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;
    console.log('page admin')
    try{
        const users = await User.find({role:"user"}).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();
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
    const {name} = req.body;
    console.log(req.body)
}

export const shopdetails = async (req:Request,res:Response) => {
    
}