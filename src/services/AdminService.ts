import { AppError } from "../middleware/errorHandler";
import { HttpStatusCode, IUser } from "../utils/interface";
import BaseService from "./BaseService";
import AdminRepository from "../repositories/AdminRepository";
import logger from "../middleware/logger";

export default class AdminService extends BaseService<IUser> {
    constructor(protected repository: AdminRepository) {
      super(repository);
  };
      
      async toggleStatus(id: string):Promise<IUser>{
          const user = await this.repository.toggleStatusById(id);
          if(!user){
            logger.error('User not found')
            throw new AppError('User not found',HttpStatusCode.NOT_FOUND);
          } 

          return user
      }
  
      async findUsers(skip:number,limit:number): Promise<IUser[] | null> {
        return await this.repository.findUsers(skip,limit);
      }

      async findCountUsers():Promise<number | null>{
        return await this.repository.findCountUsers();
      }




}

