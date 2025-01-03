import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import chatModel from "../models/Chat";
import ChatRepository from "../repositories/ChatRepository";
import { HttpStatusCode,  IChat,  IMessage,  } from "../utils/interface";
import BaseService from "./BaseService";

export default class ChatService extends BaseService<IChat> {

    constructor(protected repository: ChatRepository) {
        super(repository);
    };
    

    async createNewRoom(userId:string,shopId:string): Promise<IChat> {
        const existingChatroom =  await this.repository.findexistingRooms({userId,shopId});
        if(!existingChatroom){
            const newChatroom = new chatModel({
                userId,
                shopId
            });
            const CreatedNewRoom = await newChatroom.save();
            if(!CreatedNewRoom){
                logger.error('error in create new chat rooms')
                throw new AppError('error in create new chat rooms',HttpStatusCode.BAD_REQUEST);    
            }
            return CreatedNewRoom
        } else{
            return existingChatroom;
        }
    }

    async findAllChatsbyId(filter:any): Promise<IChat[]> {
        const chatrooms =  await this.repository.findAllChatsbyId(filter);
        if(!chatrooms){
            logger.error('error in fetch all chat rooms')
            throw new AppError('error in fetch all chat rooms',HttpStatusCode.BAD_REQUEST);
        } 
        return chatrooms;
    }

 


}

