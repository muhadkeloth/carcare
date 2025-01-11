import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import MessageRepository from "../repositories/MessageRepository";
import { HttpStatusCode,  IMessage,  } from "../utils/interface";
import BaseService from "./BaseService";
import messageModel from "../models/Message";


export default class MessageService extends BaseService<IMessage> {

    constructor(protected repository: MessageRepository) {
        super(repository);
    };
    

    async fetchAllMessagesByChatId(chatId: string): Promise<IMessage[]> {
        const allMessages =  await this.repository.fetchAllMessagesByChatId(chatId);
        if(!allMessages){
            logger.error('error in fetch messages')
            throw new AppError('error in fetch messages',HttpStatusCode.BAD_REQUEST);
        } 
        return allMessages;
    }
 
    async saveMessageByChatId(chatId: string,senderId:string,message:string,imagePath:string|null): Promise<IMessage> {
        const messageData:any = { chatId,senderId,message }
        if (imagePath) { messageData.image = imagePath; }
        const newMessage = new messageModel(messageData)
        const savedMessage = await newMessage.save();
        if(!savedMessage){
            logger.error('error in save message')
            throw new AppError('error in save message',HttpStatusCode.BAD_REQUEST);    
        }
        return savedMessage
    } 
    
    async findChatMessagesByRoomId(filter: any): Promise<any> {
        const chatRooms = await this.repository.findChatMessagesByRoomId(filter);
        if (!chatRooms) {
          logger.error('Error in fetching all chat rooms with last messages');
          throw new AppError('Error in fetching all chat rooms', HttpStatusCode.BAD_REQUEST);
        }
        return chatRooms;
      }
      

    
 


}

