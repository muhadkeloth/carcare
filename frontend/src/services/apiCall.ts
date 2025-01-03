import { AxiosError } from "axios";
import { bodyEmailvsRole, returnApiPromise } from "../components/utilities/types";
import api from "./axiosConfig"
import { ErrorResponse } from "../components/utilities/interface";


export const fetchRefreshToken = async (url:string,refreshToken:string):Promise<returnApiPromise> => {
    try {
        return await api.post(url, {refreshToken});
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const fetchForgotPass = async (url:string,body:bodyEmailvsRole):Promise<returnApiPromise> => {
    try {
        return await api.post(url, body);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
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
    }
}

export const fetchOtpValidate = async (url:string,body:bodyEmailvsRole & {otp:string}):Promise<returnApiPromise> => {
    try {
        return await api.post(url,body)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const fetchSetPassword = async (url:string,body:bodyEmailvsRole & {password:string}):Promise<returnApiPromise> => {
    try {
        return await api.post(url,body);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const fetchSignup = async (url:string,userData:any):Promise<returnApiPromise> => {
    try {
        return await api.post(url,userData)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}


