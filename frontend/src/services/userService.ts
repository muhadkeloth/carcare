import { AxiosError } from "axios";
import { ErrorResponse, HttpStatusCode, Shop } from "../components/utilities/interface";
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
    }
}

export const fetchUserData = async ():Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get('/userdetails')
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopData = async (id:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopdetails/${id}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchPincode = async (pincode:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopByPincode = async (pincode:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopsFilterByPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchModeldetail = async (_id:string,make:string):Promise<{status:number,data:any}> => {
    try {
        return await api.get(`/getModelByMake`, {params:{ _id,make} })
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const fetchUserUploadProfileImage = async (formData:FormData):Promise<{status:number;data:any}> => {
    try {
        console.log('fomr ',formData);
        const response = await api.put('/uploadprofileimage',formData);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error when uploading user profile image');
        return {status:response.status,data:response.data};
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchUserUpdateProfileDetails = async (details:any):Promise<{data:any}> => {
    try {
        const response = await api.put('/updateprofiledetails',details);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error when updating profile details');
        return {data:response.data};
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const changePasswordUser = async (body:{currentPassword:string; newPassword:string}):Promise<{data:any}> => {
    try {
        const response = await api.put('/changepassword',body);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error changing password');
        return {data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const confirmBooking = async (token:any,bookingDetails:any,description:string):Promise<{status:number;data:any}> => {
    try {
        const response = await api.post('/bookingConfirm',{
            token,
            bookingDetails,
            description,
        })
        if(response.status !== HttpStatusCode.SUCCESS)throw new Error('payment error');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}



export const fetchAllBookingsByUser = async (page:number):Promise<{status:number,data:any}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/bookingDetailsByUser?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find booking details');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const cancelBookingStatus = async (id:string,status:string,reason:string):Promise<{status:number,data:any}> => {
    try {
        const response = await api.patch(`/booking/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  booking status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllPickupsByUser = async (page:number):Promise<{status:number,data:any}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/pickupsDetailsByUser?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find pickup details');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const cancelpickupStatus = async (id:string,status:string,reason:string):Promise<{status:number,data:any}> => {
    try {
        const response = await api.patch(`/pickup/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  pickup status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const updateFeedback = async (id:string,rating:number,feedback:string,bookingModel:string):Promise<{status:number,data:any}> => {
    try {
        const response = await api.patch(`/feedback/${id}`, {rating,feedback,bookingModel})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to update feedback and rating');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopReviews = async(id:string|undefined):Promise<{status:number,data:any}> => {
    try {
        const response = await api.get(`/reviewsByshop/${id}`)
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch reviews');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}