import { Request, Response } from "express";
import User from "../models/User";
import Shop from "../models/Shop";
import { randomPassword } from "../utils/functions";



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
        console.log('addshop', phoneNumber, location )
        const parseAddress = JSON.parse(address);
        console.log('parseAddress', parseAddress )
        const parsedLocation  = JSON.parse(location);
        const otp = randomPassword(8);

        const newShop = new Shop({
            shopName,
            ownerName,
            email,
            phoneNumber,
            address:parseAddress,
            otp,
            location:parsedLocation ,
            image:req.file ? req.file.path :null,
        })
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