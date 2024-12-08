import Pickups from "../models/Pickups";
import { IBookings } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class PickupRepository extends BaseRepository<IBookings>{

    constructor(pickupModel: typeof Pickups){
        super(pickupModel);
    }

    async findPickupsByShopId(shopId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({shopId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image');
    }

    async findPickupsCountByShopId(shopId:string):Promise<number | null> {
        return await this.model.countDocuments({shopId})
    }

    async togglePickupStatusById(id:string):Promise<IBookings | null>{
        return await this.model.findById(id);   
    }

            
 

}

