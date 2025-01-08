import Bookings from "../models/Bookings";
import { IBookings } from "../utils/interface";
import BaseRepository  from "./BaseRepository";

export default class BookingRepository extends BaseRepository<IBookings>{

    constructor(bookingModel: typeof Bookings){
        super(bookingModel);
    }

    async findBookingsById(data:any):Promise<IBookings | null> {
        return await this.model
            .findOne(data)
            .sort({createdAt: -1})
            .populate('userId','username email phoneNumber image');
    }


    async findBrokerage(filter:any,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find(filter)
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image')
            .populate('shopId','shopName email image');
    }

    async findBrockerageCount(filter:any):Promise<number | null> {
        return await this.model.countDocuments(filter)
    }

    async findBookingByShopId(shopId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({shopId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('userId','username email phoneNumber image');
    }

    async findBookingCountByShopId(shopId:string):Promise<number | null> {
        return await this.model.countDocuments({shopId})
    }
   
    async findBookingByUserId(userId:string,skip:number,limit:number):Promise<IBookings[] | null> {
        return await this.model
            .find({userId})
            .sort({createdAt: -1})
            .skip(skip).limit(limit)
            .populate('shopId','-password')
            .populate('userId','username email phoneNumber image');
    }

    async findBookingCountByUserId(userId:string):Promise<number | null> {
        return await this.model.countDocuments({userId})
    }

    async findBookingById(id:string):Promise<IBookings | null>{
        return await this.model.findById(id);   
    }

    async findBookingsAvailableTimes(filter:object):Promise<any[] | null>{
        return await this.model.find(filter,{"shedule.time":1,"_id":0})
    }

    async findBookingsByFilter(filter:object):Promise<IBookings[] | null>{
        return await this.model.find(filter).populate('userId')
    }
    
    async findReviwesByShopId(shopId:string):Promise<Partial<IBookings[] | null>>{
        return await this.model.find({shopId,review:{$exists:true}})
            .select("review ueserId updatedAt")
            .populate('userId',"username image")
    }
   
    async findRandomReviwes():Promise<Partial<IBookings[] | null>>{
        return await this.model.aggregate([
            { $match:{review:{$exists:true},"review.rating": { $gt: 3 }, "review.feedback": { $exists: true, $ne: "" }, },},
            { $sample: { size: 5 } },
            { $lookup: {  from: "users", localField: "userId", foreignField: "_id", as: "userDetails", }},
            { $unwind: "$userDetails" },
            { $project: { review: 1, userId: 1, updatedAt: 1, "userDetails.username": 1, "userDetails.image": 1, },
            },
        ])
    }

    async findBookingsCountForChart (filter:any):Promise<any[] | null> {
        return await this.model.aggregate([
            { $match:filter },
            { $group: { _id:{ $dateToString: { format:'%Y-%m',date:"$createdAt"}},count:{$sum:1}}},
            { $sort:{_id:1}}
        ])
    }
   
    async findBookingsPriceCountForChart (filter:any):Promise<any[] | null> {
        return await this.model.aggregate([
            { $match:filter },
            { $group: { _id:{ $dateToString: { format:"%Y-%m",date:"$createdAt"}},total:{$sum:"$amount"}}},
            { $sort:{_id:1}}
        ])
    }
    
    async findBookingsRatingCountForChart (filter:any):Promise<any[] | null> {
        return await this.model.aggregate([
            { $match:filter },
            { $group: { _id: "$review.rating",count:{$sum:1}}},
            { $project:{rating:"$_id", count:1,_id:0}}
        ])
    }
    
    async findUpComingBookings (filter:any,now:Date,nextWeek:Date):Promise<any[] | null> {
        return await this.model.aggregate([
            {
                $match:filter
            },{
                $project:{
                    sheduleDate:{$toDate:"$shedule.date"},
                    userDetails:1,
                    shedule:1,

                }
            },{
                $match:{
                    sheduleDate:{
                        $gte:now,
                        $lt: nextWeek
                    }
                }
            },{
                $limit:10
            }
        ]);
    }
    
    async findTotalBookingsByStatus (filter:any):Promise<any[] | null> {
        return await this.model.aggregate([
            { $match: filter },
            { $group: { _id:"$status", count:{$sum:1} }}
        ]);
    }
    
    async findTotalBookingRevenue (filter:any):Promise<any[] | null> {
        return await this.model.aggregate([
            { $match: filter },
            { $group: {  _id:null, totalAmount:{$sum:"$amount"} }}
        ]);
    }


   
 

}

