import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
    .replace('{{carCareUrl}}',`${process.env.CarCare_icon}/public/images/CarCare_icon.png`)
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
        console.log('otp sent successfully')
    }catch(error){
        console.log('error sending otp:',error);
        throw new Error('failed to send otp')
    }
}