import { AxiosError } from "axios";
import { ErrorResponse, HttpStatusCode, Shop } from "../components/utilities/interface";
import api from "./axiosConfig";
import { navigateLogin } from "../components/utilities/navigate/common";
import { returnApiPromise } from "../components/utilities/types";


export const fetchTopShops = async ():Promise<Shop[]> => {
    try{
        const response = await api.get('/getshopsforHome');
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error find shops for homepage');
        return response.data.shops;
    }catch(error){
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

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
// export const fetchNearbyShops = async (latitude:number,longitude:number,query?:any,skip?:number):Promise<Shop[]> => {
//     try{
//         const {data} = await api.get('/getnearshops', {
//             params: { latitude, longitude, query, skip },
//         });
//         return data.shops;
//     }catch(error){
//         const err = error as AxiosError<ErrorResponse>
//         throw new Error(err?.response?.data?.message);
//     }
// }

export const fetchUserData = async (navigate:any):Promise<returnApiPromise> => {
    try {
       const response =  await api.get('/userdetails')
       return {status:response.status,data:response.data}
    } catch (error) {
        localStorage.removeItem('user_access_token')
        localStorage.removeItem('user_refresh_token')
        navigateLogin(navigate,'user')
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchRandomFeedback = async ():Promise<returnApiPromise> => {
    try {
       const response =  await api.get(`/randomfeedback`)  
       if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error find feedback');
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllVehicle = async():Promise<{Vehicle:any[];}> => {
    try {
        const response = await api.get(`/allvehicledetails`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error(`unexpected status code when fetching vehicle details: ${response.status}`)
        
        const {data} = response;
        if(data && data.Vehicle){
            return {Vehicle:data.Vehicle}
        }else{
            throw new Error('invalid vehicle response structure.')
        }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopData = async (id:string):Promise<returnApiPromise> => {
    try {
       const response =  await api.get(`/shopdetails/${id}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchPincode = async (pincode:string):Promise<returnApiPromise> => {
    try {
       const response =  await api.get(`/shopPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopByPincode = async (pincode:string):Promise<returnApiPromise> => {
    try {
       const response =  await api.get(`/shopsFilterByPincode/${pincode}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchModeldetail = async (_id:string,make:string):Promise<returnApiPromise> => {
    try {
        return await api.get(`/getModelByMake`, {params:{ _id,make} })
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const fetchUserUploadProfileImage = async (formData:FormData):Promise<{status:number;data:any}> => {
    try {
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

export const fetchReservedTimes = async (date:any,action:string,shopId:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.get('/bookingAvailableTime',{params:{date,action,shopId}})
        if(response.status !== HttpStatusCode.SUCCESS)throw new Error('fetch reserved times error');
        return response;
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



export const fetchAllBookingsByUser = async (page:number):Promise<returnApiPromise> => {
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

export const cancelBookingStatus = async (id:string,status:string,reason:string):Promise<returnApiPromise> => {
    try {
        const response = await api.patch(`/booking/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  booking status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllPickupsByUser = async (page:number):Promise<returnApiPromise> => {
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

export const cancelpickupStatus = async (id:string,status:string,reason:string):Promise<returnApiPromise> => {
    try {
        const response = await api.patch(`/pickup/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  pickup status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const updateFeedback = async (id:string,rating:number,feedback:string,bookingModel:string):Promise<returnApiPromise> => {
    try {
        const response = await api.patch(`/feedback/${id}`, {rating,feedback,bookingModel})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to update feedback and rating');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchShopReviews = async(id:string|undefined):Promise<returnApiPromise> => {
    try {
        const response = await api.get(`/reviewsByshop/${id}`)
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch reviews');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const findChatRoom = async(shopId:string):Promise<returnApiPromise> => {
    try {
        const response = await api.get(`/createChatRoom/${shopId}`);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to fetch create chat room');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchChatRooms = async():Promise<returnApiPromise> => {
    try {
        const response = await api.get('/chatHistory');
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch chathistory');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllMessages = async(chatRoomId:string):Promise<returnApiPromise> => {
    try {
        const response = await api.get(`/fetchMessages/${chatRoomId}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch messages');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const saveImageMessage = async(formData:FormData):Promise<returnApiPromise> => {
    try {
        const response = await api.post('/saveImageMessage',formData);   
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to save image messages');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const saveMessage = async(chatId:string,message:string,imagePath:string|null):Promise<returnApiPromise> => {
    try {
           const response = await api.post(`/saveMessage`,{chatId,message,imagePath});
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to save messages');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const estimateFinder = async(task:string):Promise<returnApiPromise> => {
    try {
           const response = await api.post(`/estimateFinder`, {task});
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find estimate');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}