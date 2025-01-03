import { Document } from "mongoose";
import BaseRepository from "../repositories/BaseRepository";
import { AppError } from "../middleware/errorHandler";
import { HttpStatusCode } from "../utils/interface";
import bcrypt from 'bcryptjs';
import logger from "../middleware/logger";


export default abstract class BaseService<T extends Document> {

    constructor(protected repository:BaseRepository<T>) {};

    
    async findOne(data:any):Promise<T | null> {
        return await this.repository.findOne(data); 
    }


    async validatePassword( inputPassword: string, storedPassword: string, inputType:string){//check for impliment in base
        const isValid = await bcrypt.compare(inputPassword, storedPassword);
        if (!isValid) {
            logger.error(`Invalid ${inputType}`)
            throw new AppError(`Invalid ${inputType}`, HttpStatusCode.BAD_REQUEST);
        }
    }


    

}