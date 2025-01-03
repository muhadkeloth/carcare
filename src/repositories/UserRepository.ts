import User from "../models/User";
import { IUser } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class UserRepository extends BaseRepository<IUser>{

    constructor(userModel: typeof User){
        super(userModel);
    }

    async updateById(Id: string, updateData: IUser){
       return  await this.model.findByIdAndUpdate(Id, updateData, { new: true });
    }
            
 

}

