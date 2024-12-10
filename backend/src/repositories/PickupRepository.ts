import Pickups from "../models/Pickups";
import { IBookings } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class PickupRepository extends BaseRepository<IBookings>{

    constructor(pickupModel: typeof Pickups){
        super(pickupModel);
    }

    async findPickupsById(data:any):Promise<IBookings | null> {
        return await this.model
            .findOne(data)
            .sort({createdAt: -1})
            .populate('userId','username email phoneNumber image');
    }

    async findPickupsByShopId(userId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({userId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image');
    }

    async findPickupsCountByShopId(userId:string):Promise<number | null> {
        return await this.model.countDocuments({userId})
    }
   
    async findPickupsByUserId(userId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({userId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image');
    }

    async findPickupsCountByUserId(userId:string):Promise<number | null> {
        return await this.model.countDocuments({userId})
    }

    async togglePickupStatusById(id:string):Promise<IBookings | null>{
        return await this.model.findById(id);   
    }

            
 

}

