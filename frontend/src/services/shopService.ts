import api from "./axiosConfig";



export const fetchAllShopVehicle = async (page:number):Promise<{shopVehicle:any[];totalPages:number}> => {
    const itemsPerPage = 10;
    try {
        const response = await api.get(`/shop/vehicledetails?page=${page}&limit=${itemsPerPage}`);
        if(response.status !== 201) throw new Error(`unexpected status code when fetching vehicle details: ${response.status}`)
        
        const {data} = response;
        if(data && data.shopVehicle){
            return {shopVehicle:data.shopVehicle,totalPages:data.totalPages}
        }else{
            throw new Error('invalid shop vehicle response structure.')
        }
    } catch (error) {
        console.error('error in fetching shop vehicle details',error);
        throw new Error('unable to fetch shop vehicle details'); 
    }
}

export const addNewVehicle = async (newVehicle:any):Promise<{status:number;message:string}> => {
    try {
        const response = await api.post('/shop/addvehicle', newVehicle);
        if(response.status !== 201) throw new Error('error in adding new vehicle');
        return {status:response.status,message:response.data.message}
    } catch (error) {
        console.error('Error adding new shop:', error);
        throw new Error('error in adding new vehicle');
    }
}

export const editNewVehicle = async (id:string,newVehicle:any):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put(`/shop/editvehicle/${id}`, newVehicle);

        if(response.status !== 201) throw new Error('error in updat fetch vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        console.error('Error adding new shop:', error);
        throw new Error('error in update  vehicle');
    }
}

export const deleteNewVehicle = async (id:string):Promise<{status:number;data:any}> => {
    try {
        const response = await api.delete(`/shop/deletevehicle/${id}`);

        if(response.status !== 201) throw new Error('error in adding new vehicle');
        return {status:response.status,data:response.data}
    } catch (error) {
        console.error('Error adding new shop:', error);
        throw new Error('error in adding new vehicle');
    }
}

export const fetchShopUserDetails = async ():Promise<{status:number;data:any}> => {
    try {
        const response = await api.get('/shop/shopdetails');
        if(response.status !== 201) throw new Error('error to find shopuser details');
        return {status:response.status,data:response.data}
    } catch (error) {
        console.error('Error finding shop user details:', error);
        throw new Error('error in  finding shop user details');
    }
} 

export const fetchUploadProfileImage = async (formData:FormData):Promise<{status:number;data:any}> => {
    try {
        const response = await api.put('/shop/uploadprofileimage',formData);
        if(response.status !== 201) throw new Error('error when uploading shop profile image');
        return {status:response.status,data:response.data};
    } catch (error) {
        console.error('Error uploading shop user profile image:', error);
        throw new Error('error in uploading shop user profile image');
    }
}

export const fetchUpdateProfileDetails = async (details:any):Promise<{data:any}> => {
    try {
        const response = await api.put('/shop/updateprofiledetails',details);
        if(response.status !== 201) throw new Error('error when updating shop profile details');
        return {data:response.data};
    } catch (error) {
        console.error('Error updating shop user profile details:', error);
        throw new Error('error in updating shop user profile details');
    }
}

export const changePasswordShop = async (body:{currentPassword:string; newPassword:string}):Promise<{data:any}> => {
    try {
        const response = await api.put('/shop/changepassword',body);
        if(response.status !== 201) throw new Error('error changing password');
        return {data:response.data}
    } catch (error) {
        console.error('Error profile changing password:', error);
        throw new Error('Error profile changing password:');
    }
}