import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_KEY || '',{
    apiVersion: '2024-11-20.acacia',
}) 


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

