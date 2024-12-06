import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import BookingRepository from "../repositories/BookingRepository";
import UserRepository from "../repositories/UserRepository";
import { HttpStatusCode, IBookings } from "../utils/interface";
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

