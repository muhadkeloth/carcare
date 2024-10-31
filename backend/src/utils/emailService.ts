import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user:process.env.MAILERID,
        pass:process.env.MAILERPASSWORD,
    }
});

export const sendOtpEmail = async (to: string,otp: string) => {
    console.log(process.env.MAILERPASSWORD)
    console.log(process.env.MAILERID,)
    const mailOptions = {
        from: process.env.MAILERID,
        to,
        subject:'Your OTP Code',
        text: `your otp code is ${otp}. It is valid for 5 minutes.`,
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log('otp sent successfully')
    }catch(error){
        console.log('error sending otp:',error);
        throw new Error('failed to send otp')
    }
}