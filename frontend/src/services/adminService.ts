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
