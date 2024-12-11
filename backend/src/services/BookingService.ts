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
        const booking =  await this.repository.create(data);
        if(!booking){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return booking;
      }

      async updatePaymentStatus(_id:string,data: IBookings): Promise<IBookings> {
        const booking =  await this.repository.findBookingsById({_id});
        if(!booking){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        booking.paymentStatus = data.paymentStatus;
        return await booking.save();
        // const updatedBooking = await this.repository.update(id,data);
        // if(!updatedBooking){
        //     logger.error('error in create')
        //     throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        // }
        // return updatedBooking;
    }





      async findBookingsByShopId(shopId:string,skip:number,limit:number): Promise<IBookings[] | null> {
        const bookings =  await this.repository.findBookingByShopId(shopId,skip,limit);
        if(!bookings){
            logger.error('error find booking details details')
            throw new AppError('error find booking details details',HttpStatusCode.BAD_REQUEST);
        } 
        return bookings;
    }
    
    async findBookingsCountByShopId(shopId:string): Promise<number | null> {
        return await this.repository.findBookingCountByShopId(shopId);
    }

      async findBookingsByUserId(userId:string,skip:number,limit:number): Promise<IBookings[] | null> {
        const bookings =  await this.repository.findBookingByUserId(userId,skip,limit);
        if(!bookings){
            logger.error('error find  details')
            throw new AppError('error find  details',HttpStatusCode.BAD_REQUEST);
        } 
        return bookings;
    }
    
    async findBookingsCountByUserId(userId:string): Promise<number | null> {
        return await this.repository.findBookingCountByUserId(userId);
    }

    async toggleBookingStatus(id: string,status:pickupStatus,reason:string,role:'user'|'shop'):Promise<IBookings |null >{
        const bookingdetails = await this.repository.toggleBookingStatusById(id);
        if(!bookingdetails){
          logger.error(' details not found')
          throw new AppError(' details not found',HttpStatusCode.NOT_FOUND);
        } 
        bookingdetails.status = status;
        if(bookingdetails.status == 'CANCELLED'){
            if(bookingdetails.paymentStatus == 'PAID'){
                bookingdetails.paymentStatus = 'REFUNDED';
            }else{
                bookingdetails.paymentStatus = 'FAILED';
            }
            bookingdetails.paymentFailDetails = {
                reason,
                actionFrom:role
            };
        }
        // return  await pickupdetails.save();
        const updatedDetails =  await bookingdetails.save();
        return await this.repository.findBookingsById({_id:updatedDetails._id})
        // bookingdetails.status = status;
        // return await bookingdetails.save();
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

