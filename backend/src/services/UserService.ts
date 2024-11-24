import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import UserRepository from "../repositories/UserRepository";
import { HttpStatusCode, IUser } from "../utils/interface";
import BaseService from "./BaseService";

export default class UserService extends BaseService<IUser> {

    constructor(protected repository: UserRepository) {
        super(repository);
    };
    

    // ******************************************
    async create(data: IUser): Promise<IUser> {//make it base wiith save()
        const user =  await this.repository.create(data);
        if(!user){
            logger.error('error in create')
            throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
        } 
        return user;
      }
// *******************************************




}

