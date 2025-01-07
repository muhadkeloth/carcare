import { AxiosError } from "axios";
import { ErrorResponse, HttpStatusCode } from "../components/utilities/interface";
import api from "./axiosConfig";
import { returnApiPromise } from "../components/utilities/types";




export const fetchAllShop = async (page:number):Promise<{ workShop:any[]; totalPages:number }> => {
    const itemsPerPage = 10;
    try{
        const response = await api.get(`/admin/shopdetails?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error(`unexpected status when shop details fetch code:${response.status}`)
        
        const {data} = response;
        if(data && data.workShop){
            return { workShop:data.workShop, totalPages:data.totalPages };
        }else{
            throw new Error('Invalid shop details response structure.')
        }
    }catch(error){
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const addNewShop = async (formData:any) => {
    try {
        await api.post('/admin/addShop', formData);
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchAllUsers = async (page:number):Promise<{users:any[]; totalPages:number}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/admin/users?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS)throw new Error(`unexpected status code:${response.status}`);
    
            const {data} = response;
            if(data && data.users ){
                return {users:data.users, totalPages:data.totalPages }
            }else{
                throw new Error('Invalid userdetails response structure.')
            }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const toggleuserStatus = async (id:string):Promise<returnApiPromise> => {
    try {
        return api.patch(`/admin/user/${id}`)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const toggleShopStatus = async (id:string):Promise<returnApiPromise> => {
    try {
        return api.patch(`/admin/shopstatus/${id}`)
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}


export const fetchAllVehicle = async (page:number):Promise<{Vehicle:any[];totalPages:number}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/admin/vehicledetails?page=${page}&limit=${itemsPerPage}`);
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
        const response = await api.post('/admin/addvehicle', newVehicle);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in adding new vehicle');
        return {status:response.status,message:response.data.message}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const editVehicle = async (newVehicle:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put(`/admin/editvehicle`, newVehicle);

        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in updat fetch vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const deleteVehicle = async (brand:string):Promise<{status:number}> => {
    try {
        const response = await api.delete(`/admin/deletevehicle/${brand}`);

        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error in deleting vehicle');
        return {status:response.status}
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchStatistics = async ():Promise<{status:number,data:any}> => {
    try {
        const response = await api.get(`/admin/dashStatistics/`)
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch statistics');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchfilterCountCart = async (period:'monthly'|'yearly'|'weekly'):Promise<{status:number,data:any}> => {
    try {
        const response = await api.get(`/admin/barChartFilter?period=${period}`)
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch bar chart filter');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchfilterPriceCart = async (period:'monthly'|'yearly'|'weekly'):Promise<{status:number,data:any}> => {
    try {
        const response = await api.get(`/admin/lineChartFilter?period=${period}`)
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to fetch line chart filter');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}

export const fetchBrokerageTable = async(page:number,action:string):Promise<{status:number,data:any}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/admin/brokerageDetails/${action}?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error to find brokerage details');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message);
    }
}