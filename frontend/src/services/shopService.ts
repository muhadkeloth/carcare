import { AxiosError } from "axios";
import { ErrorResponse, Estimate, HttpStatusCode } from "../components/utilities/interface";
import api from "./axiosConfig";



export const fetchShopUserDetails = async ():Promise<{status:number;data:any}> => {
    try {
        const response = await api.get('/shop/shopdetails');
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find shopuser details');
        return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
} 

export const fetchUploadProfileImage = async (formData:FormData):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put('/shop/uploadprofileimage',formData);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error when uploading shop profile image');
        return {status:response.status,data:response.data};
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchUpdateProfileDetails = async (url:string,details:any):Promise<{data:any}> => {
    try {
        const response = await api.put(url,details);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error when updating shop profile details');
        return {data:response.data};
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchUpdateProfileWorkTime = async (opening:string,closing:string):Promise<{data:any}> => {
    try {
        const response = await api.put('/shop/updateprofileWorkTime',{opening,closing});
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error when updating shop work time');
        return {data:response.data};
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const changePasswordShop = async (body:{currentPassword:string; newPassword:string}):Promise<{data:any}> => {
    try {
        const response = await api.put('/shop/changepassword',body);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error changing password');
        return {data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const fetchAllVehicle = async():Promise<{Vehicle:any[];}> => {
    try {
        const response = await api.get(`/shop/allvehicledetails`);
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

export const fetchAllShopVehicle = async (page:number):Promise<{Vehicle:any[];totalPages:number}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/shop/vehicledetails?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error(`unexpected status code when fetching vehicle details: ${response.status}`)
        
        const {data} = response;
        if(data && data.Vehicle){
            return {Vehicle:data.Vehicle,totalPages:data.totalPages}
        }else{
            throw new Error('invalid vehicle response structure.')
        }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const addNewVehicle = async (newVehicle:any):Promise<{status:number;message:string}> => {
    try {
        const response = await api.post('/shop/addvehicle', newVehicle);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in adding new vehicle');
        return {status:response.status,message:response.data.message}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const editVehicle = async (newVehicle:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put(`/shop/editvehicle`, newVehicle);

        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in updat fetch vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const deleteShopVehicle = async (brand:string):Promise<{status:number}> => {
    try {
        const response = await api.delete(`/shop/deletevehicle/${brand}`);

        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error in deleting vehicle');
        return {status:response.status}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const createShopEstimate = async(newEstimate:Estimate):Promise<{status:number;message:string}> => {
    const response = await api.post('/shop/addestimate', newEstimate);
    return {status:response.status,message:response.data.message}
}

export const fetchAllestimates = async(page:number):Promise<{Estimate:any[];totalPages:number}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/shop/allEstimatedetails?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error(`unexpected status code when fetching estimate details: ${response.status}`)
        
        const {data} = response;
        if(data && data.Estimate){
            return {Estimate:data.Estimate,totalPages:data.totalPages}
        }else{
            throw new Error('invalid Estimate response structure.')
        }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const editEstimate = async (newEstimate:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put(`/shop/editestimate`, newEstimate);

        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in updat fetch vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const deleteShopEstimate = async (work:string):Promise<{status:number}> => {
    try {
        const response = await api.delete(`/shop/deleteestimate/${work}`);

        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error in deleting vehicle');
        return {status:response.status}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllPickupsByShopId = async (page:number):Promise<{status:number,data:any}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/shop/pickupsDetailsByShopId?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find pickup details');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const togglepickupStatus = async (id:string,status:string,reason:string):Promise<{status:number,data:any}> => {
    try {
        const response = await api.patch(`/shop/pickup/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  pickup status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllBookingsByShopId = async (page:number):Promise<{status:number,data:any}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/shop/bookingDetailsByShopId?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find booking details');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const toggleBookingStatus = async (id:string,status:string,reason:string):Promise<{status:number,data:any}> => {
    try {
        const response = await api.patch(`/shop/booking/${id}`, {status,reason})
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error to change  booking status');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}