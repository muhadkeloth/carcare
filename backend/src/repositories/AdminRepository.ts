import User from "../models/User";
import { HttpStatusCode, IUser } from "../utils/interface";
import BaseRepository  from "./BaseRepository";
import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";

export default class AdminRepository extends BaseRepository<IUser>{

    constructor(AdminModel: typeof User){
        super(AdminModel);
    }

    async toggleStatusById(id:string):Promise<IUser | null>{
        const user = await this.model.findById(id);
        if(!user) {
            logger.error('Item not found');
            throw new AppError('Item not found',HttpStatusCode.NOT_FOUND);
        } 
        user.isActive = !user.isActive;
        return await user.save();
    }

    async findUsers(skip:number,limit:number):Promise<IUser[] | null> {
        return await this.model.find({role:"user"}).sort({createdAt:-1}).skip(skip).limit(limit);
    }

    async findCountUsers():Promise<number | null> {
        return await this.model.countDocuments({role:'user'});
    }


}

