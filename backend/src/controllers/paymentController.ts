import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { HttpStatusCode } from "../utils/interface";
import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";

const stripe = new Stripe(process.env.STRIPE_KEY || '',{
    apiVersion: '2024-11-20.acacia',
}) 


// export const handlePayment = async (token:any,amount:number,description:string) => {
//     // const {token, amount, description} = req.body;

//     try {
//         const idempotencyKey = uuidv4();
//         const charge = await stripe.charges.create({
//             amount:Math.round(amount*100),
//             currency:"usd",
//             source:token.id,
//             description,
//         },{idempotencyKey});
//         res.status(200).json({success:true,charge});
//     } catch (error) {
//         const err = error as Error;
//         logger.error(`Error in payment request ${err.message}` );
//         next(new AppError(`error in payment request: ${err.message}`, HttpStatusCode.FORBIDDEN));
//     }
// }

export const handlePayment = async (token:any,amount:number,description:string) => {

    try {
        const idempotencyKey = uuidv4();
        const charge = await stripe.charges.create({
            amount:Math.round(amount*100),
            currency:"usd",
            source:token.id,
            description,
        },{idempotencyKey});
        
        return {success:true,charge};
    } catch (error) {
        return {success:false,error}
    }
}

