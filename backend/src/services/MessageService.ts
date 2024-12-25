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

    


    // async create(data: IBookings): Promise<IBookings> {
    //     const pickups =  await this.repository.create(data);
    //     if(!pickups){
    //         logger.error('error in create')
    //         throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
    //     } 
    //     return pickups;
    // }
    
    // async updatePaymentStatus(_id:string,data: IBookings): Promise<IBookings> {
    //     const pickups =  await this.repository.findPickupsById({_id});
    //     if(!pickups){
    //         logger.error('error in create')
    //         throw new AppError('error in create',HttpStatusCode.BAD_REQUEST);
    //     } 
    //     pickups.paymentStatus = data.paymentStatus;
    //     return await pickups.save();
    // }



 


}

