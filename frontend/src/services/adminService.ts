import api from "./axiosConfig";



export const fetchAllShop = async (page:number):Promise<{ workShop:any[]; totalPages:number }> => {
    const itemsPerPage = 10;
    try{
        const {data} = await api.get(`/admin/shopdetails?page=${page}&limit=${itemsPerPage}`);
        return { workShop:data.workShop, totalPages:data.totalPages };
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
        const {data} = await api.get(`/admin/users?page=${page}&limit=${itemsPerPage}`);
        return {users:data.users, totalPages:data.totalPages }
    } catch (error) {
        console.error('error fetching users',error);
        throw new Error('unable to fetch users')
    }
}