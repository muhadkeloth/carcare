import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import PickupRepository from "../repositories/PickupRepository";
import UserRepository from "../repositories/UserRepository";
import { HttpStatusCode, IBookings, paymentStatus, pickupStatus } from "../utils/interface";
import BaseService from "./BaseService";

export default class PickupService extends BaseService<IBookings> {

    constructor(protected repository: PickupRepository) {
        super(repository);
    };
    

    async create(data: IBookings): Promise<IBookings> {
        const user =  await this.repository.create(data);
        if(!user){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return user;
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

    async togglePickupStatus(id: string,status:pickupStatus):Promise<IBookings >{
        const pickupdetails = await this.repository.togglePickupStatusById(id);
        if(!pickupdetails){
          logger.error('pickup details not found')
          throw new AppError('pickup details not found',HttpStatusCode.NOT_FOUND);
        } 
        pickupdetails.status = status;
        return await pickupdetails.save();
        // return pickupdetails
    }

 




    // ******************************************
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

