import { AxiosError } from "axios";
import { ErrorResponse, Shop } from "../components/utilities/interface";
import api from "./axiosConfig";


export const fetchNearbyShops = async (latitude:number,longitude:number):Promise<Shop[]> => {
    try{
        const {data} = await api.get('/getnearshops', {
            params: { latitude, longitude },
        });
        return data.shops;
    }catch(error){
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching nearby shops:", error);
        // throw new Error("Unable to fetch nearby shops.");
    }
}

export const fetchUserData = async ():Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get('/userdetails')
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching nearby user detail:", error);
        // throw new Error("Unable to fetch nearby user detail.");
    }
}

export const fetchShopData = async (id:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopdetails/${id}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching nearby user detail:", error);
        // throw new Error("Unable to fetch nearby user detail.");
    }
}

export const fetchPincode = async (pincode:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching pincode:", error);
        // throw new Error("Unable to fetch pincode.");
    }
}

export const fetchShopByPincode = async (pincode:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopsFilterByPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching shop by pincode:", error);
        // throw new Error("Unable to fetch shop by pincode.");
    }
}

export const fetchModeldetail = async (_id:string,make:string):Promise<{status:number,data:any}> => {
    try {
        return await api.get(`/getModelByMake`, {params:{ _id,make} })
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
        // console.error("Error fetching model of make:", error);
        // throw new Error("Unable to fetch model of make.");
    }
}
