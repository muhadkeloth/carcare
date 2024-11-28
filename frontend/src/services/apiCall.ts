import { AxiosError } from "axios";
import { bodyEmailvsRole, returnApiPromise } from "../components/utilities/types";
import api from "./axiosConfig"
import { ErrorResponse } from "../components/utilities/interface";


export const fetchForgotPass = async (url:string,body:bodyEmailvsRole):Promise<returnApiPromise> => {
    try {
        return await api.post(url, body);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
        // console.error("Error on submit forget:", error);
        // throw new Error("Error on submit forget.");  
    }
}

export const fetchLogin = async (url:string,body:{email:string,role:string,password:string}):Promise<returnApiPromise> => {
    try {
        return await api.post(`/${url}/login`,body);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);  
    }
}

export const fetchOtpGenerate = async(url:string,body:bodyEmailvsRole):Promise<returnApiPromise> => {
    try {
        return await api.post(url,body)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
        // console.error("Error on otp generate:", error);
        // throw new Error("Error on otp generate.");
    }
}

export const fetchOtpValidate = async (url:string,body:bodyEmailvsRole & {otp:string}):Promise<returnApiPromise> => {
    try {
        return await api.post(url,body)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
        // console.error("Error on otp validate:", error);
        // throw new Error("Error on otp validate.");
    }
}

export const fetchSetPassword = async (url:string,body:bodyEmailvsRole & {password:string}):Promise<returnApiPromise> => {
    try {
        return await api.post(url,body);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
        // console.error("Error on otp password change:", error);
        // throw new Error("Error on otp password change.");
    }
}

export const fetchSignup = async (url:string,userData:any):Promise<returnApiPromise> => {
    try {
        return await api.post(url,userData)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
        // console.error("Error on fetch signup:", error);
        // throw new Error("Error on fetch signup.");
    }
}


