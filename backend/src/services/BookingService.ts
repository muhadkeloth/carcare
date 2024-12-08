import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import BookingRepository from "../repositories/BookingRepository";
import UserRepository from "../repositories/UserRepository";
import { HttpStatusCode, IBookings, pickupStatus } from "../utils/interface";
import BaseService from "./BaseService";

export default class BookingService extends BaseService<IBookings> {

    constructor(protected repository: BookingRepository) {
        super(repository);
    };
    

    // ******************************************
    async create(data: IBookings): Promise<IBookings> {
        const user =  await this.repository.create(data);
        if(!user){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return user;
      }

      async findBookingsByShopId(shopId:string,skip:number,limit:number): Promise<IBookings[] | null> {
        const bookings =  await this.repository.findBookingByShopId(shopId,skip,limit);
        if(!bookings){
            logger.error('error find pickup details')
            throw new AppError('error find pickup details',HttpStatusCode.BAD_REQUEST);
        } 
        return bookings;
    }
    
    async findBookingsCountByShopId(shopId:string): Promise<number | null> {
        return await this.repository.findBookingCountByShopId(shopId);
    }

    async toggleBookingStatus(id: string,status:pickupStatus):Promise<IBookings >{
        const bookingdetails = await this.repository.toggleBookingStatusById(id);
        if(!bookingdetails){
          logger.error('pickup details not found')
          throw new AppError('pickup details not found',HttpStatusCode.NOT_FOUND);
        } 
        bookingdetails.status = status;
        return await bookingdetails.save();
        // return pickupdetails
    }


// *******************************************

// async updateById(id:string, updateData:any):Promise<IUser> {
//     const updateddata = await this.repository.updateById(id, updateData);
//     if(!updateddata){
//         logger.error('user not found or update failed');
//         throw new AppError("user not found or update failed", HttpStatusCode.NOT_FOUND);
//     }
//     return updateddata;
// }




}

