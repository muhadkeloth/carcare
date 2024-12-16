import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import logger from '../middleware/logger';
import { formatDate } from './functions';
dotenv.config();


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user:process.env.MAILERID,
        pass:process.env.MAILERPASSWORD,
    }
});

export const sendOtpEmail = async (to: string,otp: string) => {

    const templatePath = path.join(__dirname,'emailTemplates','OtpEmailTemplate.html');
    const template = fs.readFileSync(templatePath,'utf-8');
    const isOTP = otp.length == 6;
    const subject = isOTP ? 'OTP for Account Verification':'Your Login Password for Secure Access';
    
    const emailBody = template.replace('{{subject}}',subject)
    .replace('{{otpType}}',isOTP?'OTP code':'password')
    .replace('{{otp}}',otp)
    
    const mailOptions = {
        from:{
                name:'carCare',
            address:process.env.MAILERID || '',
        } ,
        to,
        subject: `CarCare: ${subject}`,
        html: emailBody,
    };
    try{
        await transporter.sendMail(mailOptions);
        logger.info('otp sent successfully')
    }catch(error){
        logger.error(`error sending otp:${error}`)
        throw new Error('failed to send otp')
    }
}

export const sendPickupConfirmEmail = async(userDetails:{email:string;username:string;address:string|undefined;time:string;date:string}) => {
    const templatePath = path.join(__dirname,'emailTemplates','PickupConfirmation.html');
    const template = fs.readFileSync(templatePath,'utf-8');
    const url = process.env.ENDPORT_FRONTEND || '';
    
    const emailBody = template.replace('{{user_name}}',userDetails.username)
    .replace('{{pickup_Time}}',userDetails.time)
    .replace('{{pickup_date}}',formatDate(userDetails.date))
    .replace('{{user_Address}}',userDetails?.address || '')
    .replace(/{{booking_details_url}}/g,`${url}/profile`)
    .replace('{{homepage}}',url)
    
    const mailOptions = {
        from:{
                name:'carCare',
            address:process.env.MAILERID || '',
        } ,
        to:userDetails.email,
        subject: `CarCare: Pickup Confirmation `,
        html: emailBody,
    };
    try{
        await transporter.sendMail(mailOptions);
        logger.info('pickup Confirmation email sent successfully')
    }catch(error){
        logger.error(`error sending pickup Confirmation email:${error}`)
        throw new Error('failed to send pickup Confirmation email')
    }
}

export const sendCancelEmail = async(userDetails:{email:string;username:string;time:string;date:string},bookingModel:string) =>{
    const templatePath = path.join(__dirname,'emailTemplates','Cancellation.html');
    const template = fs.readFileSync(templatePath,'utf-8');
    const url = process.env.ENDPORT_FRONTEND || '';
    
    const emailBody = template.replace('{{user_name}}',userDetails.username)
    .replace(/{{bookingModel}}/g,bookingModel)
    .replace('{{time}}',userDetails.time)
    .replace('{{date}}',formatDate(userDetails.date))
    .replace('{{profile_link}}',`${url}/profile`)
    .replace('{{homepage}}',url)
    
    const mailOptions = {
        from:{
                name:'carCare',
            address:process.env.MAILERID || '',
        } ,
        to:userDetails.email,
        subject: `CarCare: ${bookingModel} Cancellation `,
        html: emailBody,
    };
    try{
        await transporter.sendMail(mailOptions);
        logger.info(`${bookingModel} cancellation email sent successfully`)
    }catch(error){
        logger.error(`error sending ${bookingModel} cancellation email:${error}`)
        throw new Error(`failed to send ${bookingModel} cancellation email`)
    }


}