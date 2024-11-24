import { Document, Model } from "mongoose";


export default abstract class BaseRepository<T extends Document> {

    constructor(protected model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data)
    }

    async findOne(data:any): Promise<T | null> {
        return await this.model.findOne(data)
    }
    

}