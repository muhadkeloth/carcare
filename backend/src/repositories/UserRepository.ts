import User from "../models/User";
import { IUser } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class UserRepository extends BaseRepository<IUser>{

    constructor(userModel: typeof User){
        super(userModel);
    }
    
 

}

