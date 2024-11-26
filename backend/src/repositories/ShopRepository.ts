import Shop from "../models/Shop";
import { HttpStatusCode, IShop } from "../utils/interface";
import BaseRepository from "./BaseRepository";
import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";


export default class ShopRepository extends BaseRepository<IShop> {

    constructor(shopModel: typeof Shop){
        super(shopModel);
    }

    async updateById(Id: string, updateData: { shopName: string, ownerName: string, phoneNumber: string, about: string, location: string, image: string}){
        return  await Shop.findByIdAndUpdate(Id, updateData, { new: true });
    }

     async findNearbyShops(latitude:number,longitude:number,radiusInKm:number,limit:number){
        return await Shop.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distance",
                    maxDistance: radiusInKm * 1000, // Convert km to meters
                    spherical: true,
                },
            },
            {
                $match: { isActive: true },
            },
            {
                $limit: limit,
            },
        ])
    }


    async findShopById(id:string):Promise<IShop | null> {
        return await this.model.findOne({_id:id,isActive:true}).select("-password -otp -otpExpiry");
    }

    async findShops(skip:number,limit:number):Promise<IShop[] | null> {
        return await this.model.find().sort({createdAt:-1}).skip(skip).limit(limit);
    }


    async findCountShops():Promise<number | null> {
        return await this.model.countDocuments();
    }
    
    async toggleStatusById(id:string):Promise<IShop | null>{
        const shop = await this.model.findById(id);
        if(!shop){
            logger.error('Item not found')
            throw new AppError('Item not found',HttpStatusCode.NOT_FOUND);
        } 

        shop.isActive = !shop.isActive;
        return await shop.save();
    }

    async findVehicles(_id:string):Promise<IShop | null>{
        return this.model.findOne({_id},{vehicleIds:1}).populate('vehicleIds.vehicleModelIds')
    }

  

  


  

    

}

