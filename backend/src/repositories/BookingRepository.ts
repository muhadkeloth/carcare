import Bookings from "../models/Bookings";
import { IBookings } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class BookingRepository extends BaseRepository<IBookings>{

    constructor(bookingModel: typeof Bookings){
        super(bookingModel);
    }

    // async updateById(Id: string, updateData: IBookings){
    //    return  await this.model.findByIdAndUpdate(Id, updateData, { new: true });
    // }
            
 

}

