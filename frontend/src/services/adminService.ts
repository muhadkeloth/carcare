import { HttpStatusCode } from "../components/utilities/interface";
import api from "./axiosConfig";



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
        console.error("Error fetching nearby shops:", error);
        throw new Error("Unable to fetch nearby shops.");
    }
}

export const addNewShop = async (formData:any) => {
    try {
        await api.post('/admin/addShop', formData);
    } catch (error) {
        console.error('Error adding new shop:', error);
        throw error;
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
        console.error('error fetching users',error);
        throw new Error('unable to fetch users')
    }
}

export const toggleuserStatus = async (id:string):Promise<{status:number,data:any}> => {
    try {
        return api.patch(`/admin/user/${id}`)
    } catch (error) {
        console.error('unable to change user status',error)
        throw new Error(`unable to change user status${error}`)
    }
}

export const toggleShopStatus = async (id:string):Promise<{status:number,data:any}> => {
    try {
        return api.patch(`/admin/shopstatus/${id}`)
    } catch (error) {
        console.error('unable to change shop status',error)
        throw new Error(`unable to change shop status${error}`)
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
        console.error('error in fetching vehicle details',error);
        throw new Error('unable to fetch vehicle details'); 
    }
}

export const addNewVehicle = async (newVehicle:any):Promise<{status:number;message:string}> => {
    try {
        const response = await api.post('/admin/addvehicle', newVehicle);
        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in adding new vehicle');
        return {status:response.status,message:response.data.message}
    } catch (error) {
        console.error('Error adding new vehicle:', error);
        throw new Error('error in adding new vehicle');
    }
}

export const editVehicle = async (newVehicle:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put(`/admin/editvehicle`, newVehicle);

        if(response.status !== HttpStatusCode.CREATED) throw new Error('error in updat fetch vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        console.error('Error adding new vehicle:', error);
        throw new Error('error in update  vehicle');
    }
}

export const deleteVehicle = async (brand:string):Promise<{status:number}> => {
    try {
        const response = await api.delete(`/admin/deletevehicle/${brand}`);

        if(response.status !== HttpStatusCode.SUCCESS) throw new Error('error in deleting vehicle');
        return {status:response.status}
    } catch (error) {
        console.error('Error deleting:', error);
        throw new Error('error in deleting vehicle');
    }
}