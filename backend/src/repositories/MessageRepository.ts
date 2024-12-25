import Message from "../models/Message";
import { IMessage } from "../utils/interface";
import BaseRepository from "./BaseRepository";


export default class MessageRepository extends BaseRepository<IMessage> {

    constructor(messageModel: typeof Message){
        super(messageModel);
    }
    
    async fetchAllMessagesByChatId(chatId:string):Promise<IMessage[] | null>{
        return await this.model.find({ chatId });
    }


    


}

