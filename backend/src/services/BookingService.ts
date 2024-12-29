import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import BookingRepository from "../repositories/BookingRepository";
import UserRepository from "../repositories/UserRepository";
import { dateFilterforChart,  } from "../utils/functions";
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





      async findBrokerage(skip:number,limit:number): Promise<IBookings[] | null> {
        const bookings =  await this.repository.findBrokerage({status:'COMPLETED'},skip,limit);
        if(!bookings){
            logger.error('error find booking details for brokerage')
            throw new AppError('error find booking details for brokerage',HttpStatusCode.BAD_REQUEST);
        } 
        return bookings;
    }
    
    async findBrockerageCount(): Promise<number | null> {
        return await this.repository.findBrockerageCount({status:'COMPLETED'});
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
        const bookingdetails = await this.repository.findBookingById(id);
        if(!bookingdetails){
          logger.error(' details not found')
          throw new AppError(' details not found',HttpStatusCode.NOT_FOUND);
        } 
        bookingdetails.status = status;
        if(bookingdetails.status == 'CANCELED'){
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
        const updatedDetails =  await bookingdetails.save();
        return await this.repository.findBookingsById({_id:updatedDetails._id})
    }

    async updatefeedbackbyUser(id: string,rating:number,feedback:string):Promise<IBookings | null >{
        const bookingdetails = await this.repository.findBookingById(id);
        if(!bookingdetails){
          logger.error('booking details not found')
          throw new AppError('booking details not found',HttpStatusCode.NOT_FOUND);
        } 
        bookingdetails.review = {rating,feedback};
        const updatedDetails =  await bookingdetails.save();
        return await this.repository.findBookingsById({_id:updatedDetails._id})
    }

    async getOverdueBookings(minutesAfter:number):Promise<IBookings[] | null > {
        const now = new Date();
        const overdueTime = new Date(now.getTime() - minutesAfter * 60 * 1000);

        return await this.repository.findBookingsByFilter({
            $expr:{
                $and:[
                    { $lt: [{$dateFromString:{dateString:"$shedule.date"}},overdueTime]},
                    { $in: ["$status", ["PENDING", "CONFIRMED"]] }
                ]
            }
        })
    }

    async getReviewsByShopId(shopId:string):Promise<Partial<IBookings[]>>{
        const response =  await this.repository.findReviwesByShopId(shopId)
        if(!response){
            logger.warn("reviews not found");
            throw new AppError("reviews not found", HttpStatusCode.NOT_FOUND);
        }
        return response;
    }

    async getCompletedBookings(shopId?:string,period:'monthly'|'yearly'|'weekly' = 'monthly'):Promise<any[]> {
        const filter:any = { status:'COMPLETED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const dateFilter = dateFilterforChart(period);
        if(dateFilter) filter.createdAt = dateFilter;
        let result = await this.repository.findBookingsCountForChart(filter);
        if(!result){
            logger.warn("booking details for statistic not found");
            throw new AppError("booking details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result;
    }
    
    async getPricesBooking(shopId?:string,period:'monthly'|'yearly'|'weekly' = 'monthly'):Promise<any[]> {
        const filter:any = { status:'COMPLETED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const dateFilter = dateFilterforChart(period);
        if(dateFilter) filter.createdAt = dateFilter;
        let result = await this.repository.findBookingsPriceCountForChart(filter);
        if(!result){
            logger.warn("booking price details for statistic not found");
            throw new AppError("booking price details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    }
    
    async getRatingBooking(shopId?:string,):Promise<any[]> {
        const filter:any = { status:'COMPLETED',review:{$exists:true} }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findBookingsRatingCountForChart(filter);
        if(!result){
            logger.warn("booking rating details for statistic not found");
            throw new AppError("booking rating details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    } 
    
    async getUpComingBooking(shopId?:string):Promise<any[]> {
        const filter:any = { status:'CONFIRMED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7)
        let result = await this.repository.findUpComingBookings(filter,now,nextWeek);
        if(!result){
            logger.warn("booking upcoming details for statistic not found");
            throw new AppError("booking upcoming details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    } 
   
    async getTotalBookingByStatus(shopId?:string):Promise<any[]> {
        const filter:any = { }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findTotalBookingsByStatus(filter);
        if(!result){
            logger.warn("booking total status for statistic not found");
            throw new AppError("booking total status for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result.reduce((result, booking)=> {
            if(booking._id === "PENDING" || booking._id === "CONFIRMED"){
                result.PENDING += booking.count;
            }else if(booking._id === "COMPLETED"){
                result.COMPLETED += booking.count;
            }else if(booking._id === "CANCELED"){
                result.CANCELED += booking.count;
            }
            return result;
        },{PENDING:0,COMPLETED:0,CANCELED:0})
    } 
    
    async getTotalBookingRevenue(shopId?:string):Promise<any[]> {
        const filter:any = { status:"COMPLETED" }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findTotalBookingRevenue(filter);
        if(!result){
            logger.warn("booking total revenue for statistic not found");
            throw new AppError("booking total revenue for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
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

