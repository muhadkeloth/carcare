import Bookings from "../models/Bookings";
import { IBookings } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class BookingRepository extends BaseRepository<IBookings>{

    constructor(bookingModel: typeof Bookings){
        super(bookingModel);
    }

    async findBookingByShopId(shopId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({shopId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image');
    }

    async findBookingCountByShopId(shopId:string):Promise<number | null> {
        return await this.model.countDocuments({shopId})
    }

    async toggleBookingStatusById(id:string):Promise<IBookings | null>{
        return await this.model.findById(id);   
    }


    // async updateById(Id: string, updateData: IBookings){
    //    return  await this.model.findByIdAndUpdate(Id, updateData, { new: true });
    // }
            
 

}

