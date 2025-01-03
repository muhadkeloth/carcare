import Chat from "../models/Chat";
import { IChat } from "../utils/interface";
import BaseRepository from "./BaseRepository";


export default class ChatRepository extends BaseRepository<IChat> {

    constructor(chatModel: typeof Chat){
        super(chatModel);
    }

    
    async findexistingRooms(filter:any):Promise<IChat | null> {
        return await this.model.findOne(filter)
    }


    async findAllChatsbyId(filter:any):Promise<IChat[] | null> {
        return await this.model
        .find(filter)
        .populate('userId',"_id username image")
        .populate('shopId',"_id shopName image")
    }
    

    


}

