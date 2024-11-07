import api from "./axiosConfig"


export const fetchForgotPass = async (url:string,email:string,role:string):Promise<{status:number;data:any}> => {
    try {
        // const response = await api.post(url, {email,role});
        // return response;
        return await api.post(url, {email,role});
    } catch (error) {
        console.error("Error on submit forget:", error);
        throw new Error("Error on submit forget.");  
    }
}

export const fetchLogin = async (url:string,email:string,password:string):Promise<{status:number;data:any}> => {
    try {
        // const response = await api.post(`/${url}/login`,{email,password});
        // return response;
        return await api.post(`/${url}/login`,{email,password});
    } catch (error) {
        console.error("Error on submit password:", error);
        throw new Error("Error on submit password.");  
    }
}

export const fetchOtpGenerate = async(url:string,email:string,role:string):Promise<{status:number;data:any}> => {
    try {
        return await api.post(url,{email,role})
    } catch (error) {
        console.error("Error on otp generate:", error);
        throw new Error("Error on otp generate.");
    }
}

export const fetchOtpValidate = async (url:string,body:any):Promise<{status:number;data:any}> => {
    try {
        return await api.post(url,body)
    } catch (error) {
        console.error("Error on otp validate:", error);
        throw new Error("Error on otp validate.");
    }
}

export const fetchSetPassword = async (url:string,body:any):Promise<{status:number;data:any}> => {
    try {
        return await api.post(url,body);
    } catch (error) {
        console.error("Error on otp password change:", error);
        throw new Error("Error on otp password change.");
    }
}

export const fetchSignup = async (url:string,userData:any):Promise<{status:number,data:any}> => {
    try {
        return await api.post(url,userData)
    } catch (error) {
        console.error("Error on fetch signup:", error);
        throw new Error("Error on fetch signup.");
    }
}
