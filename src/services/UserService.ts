import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import UserRepository from "../repositories/UserRepository";
import { HttpStatusCode, IUser } from "../utils/interface";
import BaseService from "./BaseService";

export default class UserService extends BaseService<IUser> {

    constructor(protected repository: UserRepository) {
        super(repository);
    };
    

    async create(data: IUser): Promise<IUser> {
        const user =  await this.repository.create(data);
        if(!user){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return user;
      }

async updateById(id:string, updateData:any):Promise<IUser> {
    const updateddata = await this.repository.updateById(id, updateData);
    if(!updateddata){
        logger.error('user not found or update failed');
        throw new AppError("user not found or update failed", HttpStatusCode.NOT_FOUND);
    }
    return updateddata;
}




}

