import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import PickupRepository from "../repositories/PickupRepository";
import { dateFilterforChart } from "../utils/functions";
import { HttpStatusCode, IBookings, pickupStatus } from "../utils/interface";
import BaseService from "./BaseService";

export default class PickupService extends BaseService<IBookings> {

    constructor(protected repository: PickupRepository) {
        super(repository);
    };
    

    async create(data: IBookings): Promise<IBookings> {
        const pickups =  await this.repository.create(data);
        if(!pickups){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return pickups;
    }
    
    async updatePaymentStatus(_id:string,data: IBookings): Promise<IBookings> {
        const pickups =  await this.repository.findPickupsById({_id});
        if(!pickups){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        pickups.paymentStatus = data.paymentStatus;
        return await pickups.save();
    }


    async findBrokerage(skip:number,limit:number): Promise<IBookings[] | null> {
        const pickups =  await this.repository.findBrokerage({status:'COMPLETED'},skip,limit);
        if(!pickups){
            logger.error('error find pickup details for brokerage')
            throw new AppError('error find pickup details for brokerage',HttpStatusCode.BAD_REQUEST);
        } 
        return pickups;
    }

    async findBrockerageCount(): Promise<number | null> {
        return await this.repository.findBrockerageCount({status:'COMPLETED'});
    }

    async findPickupsByShopId(shopId:string,skip:number,limit:number): Promise<IBookings[] | null> {
        const pickups =  await this.repository.findPickupsByShopId(shopId,skip,limit);
        if(!pickups){
            logger.error('error find pickup details')
            throw new AppError('error find pickup details',HttpStatusCode.BAD_REQUEST);
        } 
        return pickups;
    }
    
    async findPickupsCountByShopId(shopId:string): Promise<number | null> {
        return await this.repository.findPickupsCountByShopId(shopId);
    }

    async findPickupsByUserId(userId:string,skip:number,limit:number): Promise<IBookings[] | null> {
        const pickups =  await this.repository.findPickupsByUserId(userId,skip,limit);
        if(!pickups){
            logger.error('error find pickup details')
            throw new AppError('error find pickup details',HttpStatusCode.BAD_REQUEST);
        } 
        return pickups;
    }
    
    async findPickupsCountByUserId(userId:string): Promise<number | null> {
        return await this.repository.findPickupsCountByUserId(userId);
    }

    async togglePickupStatus(id: string,status:pickupStatus,reason:string,role:'user'|'shop'):Promise<IBookings | null >{
        const pickupdetails = await this.repository.findPickupById(id);
        if(!pickupdetails){
          logger.error('pickup details not found')
          throw new AppError('pickup details not found',HttpStatusCode.NOT_FOUND);
        } 
        pickupdetails.status = status;
        if(pickupdetails.status == 'CANCELED'){
            pickupdetails.paymentStatus =  pickupdetails.paymentStatus == 'PAID' ? 'REFUNDED' : 'FAILED' ;
            pickupdetails.paymentFailDetails = {
                reason,
                actionFrom:role,
            };
        }
        const updatedDetails =  await pickupdetails.save();
        return await this.repository.findPickupsById({_id:updatedDetails._id})
    }

    async updatefeedbackbyUser(id: string,rating:number,feedback:string):Promise<IBookings | null >{
        const pickupdetails = await this.repository.findPickupById(id);
        if(!pickupdetails){
          logger.error('pickup details not found')
          throw new AppError('pickup details not found',HttpStatusCode.NOT_FOUND);
        } 
        pickupdetails.review = {rating,feedback};
        const updatedDetails =  await pickupdetails.save();
        return await this.repository.findPickupsById({_id:updatedDetails._id})
    }

    async getUpcomingPickups(minutesBefore:number):Promise<IBookings[] | null > {
        const now = new Date();
        const targetTime = new Date(now.getTime() + minutesBefore * 60 * 1000);
        return await this.repository.findPickupsByFilter({
            $expr:{
                $and:[
                    { $gte: [{$dateFromString:{dateString:"$shedule.date"}},now]},
                    { $lte: [{$dateFromString:{dateString:"$shedule.date"}},targetTime]},
                    { status:"CONFIRMED"}
                ]
            }
        })
    }

    async getOverduePickups(minutesAfter:number):Promise<IBookings[] | null > {
        const now = new Date();
        const overdueTime = new Date(now.getTime() - minutesAfter * 60 * 1000);
        return await this.repository.findPickupsByFilter({
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

    async getRandomReviews():Promise<Partial<IBookings[]>>{
        const response =  await this.repository.findRandomReviwes()
        if(!response){
            logger.warn("reviews not found");
            throw new AppError("reviews not found", HttpStatusCode.NOT_FOUND);
        }
        return response;
    }

    async getCompletedPickups(shopId?:string,period:'monthly'|'yearly'|'weekly' = 'monthly'):Promise<any[]> {
        const filter:any = { status:'COMPLETED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const dateFilter = dateFilterforChart(period);
        if(dateFilter) filter.createdAt = dateFilter;
        let result = await this.repository.findPickupsCountForChart(filter);
        if(!result){
            logger.warn("pickup details for statistic not found");
            throw new AppError("pickup details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    }

    async getPricesPickups(shopId?:string, period:'monthly'|'yearly'|'weekly' = 'monthly'):Promise<any[]> {
        const filter:any = { status:'COMPLETED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const dateFilter = dateFilterforChart(period);
        if(dateFilter) filter.createdAt = dateFilter;
        let result = await this.repository.findPickupsPriceCountForChart(filter);
        if(!result){
            logger.warn("pickup price details for statistic not found");
            throw new AppError("pickup price details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    }
    
    async getRatingPickups(shopId?:string):Promise<any[]> {
        const filter:any = { status:'COMPLETED',review:{$exists:true} }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findPickupsRatingCountForChart(filter);
        if(!result){
            logger.warn("pickup rating details for statistic not found");
            throw new AppError("pickup rating details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    }
   
    async getUpComingPickups(shopId?:string):Promise<any[]> {
        const filter:any = { status:'CONFIRMED' }
        if(shopId){
            filter.shopId = shopId;
        }
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7)
        let result = await this.repository.findUpComingPickups(filter, now,nextWeek);
        if(!result){
            logger.warn("pickup upcoming details for statistic not found");
            throw new AppError("pickup upcoming details for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result
    }
    
    async getTotalPickupsByStatus(shopId?:string):Promise<any[]> {
        const filter:any = { }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findTotalPickupsByStatus(filter);
        if(!result){
            logger.warn("pickup total status for statistic not found");
            throw new AppError("pickup total status for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        return result.reduce((result, pickup)=> {
            if(pickup._id === "PENDING" || pickup._id === "CONFIRMED"){
                result.PENDING += pickup.count;
            }else if(pickup._id === "COMPLETED"){
                result.COMPLETED += pickup.count;
            }else if(pickup._id === "CANCELED"){
                result.CANCELED += pickup.count;
            }
            return result;
        },{PENDING:0,COMPLETED:0,CANCELED:0})
    }
    
    async getTotalPickupRevenue(shopId?:string):Promise<any[]> {
        const filter:any = { status:"COMPLETED" }
        if(shopId){
            filter.shopId = shopId;
        }
        let result = await this.repository.findTotalPickupRevenue(filter);
        if(!result){
            logger.warn("pickup total revenue for statistic not found");
            throw new AppError("pickup total revenue for statistic not found", HttpStatusCode.NOT_FOUND);
        }
        if(result.length == 0){
            result = [ { _id: null, totalAmount: 0 } ]
        }
        return result
    }




}

