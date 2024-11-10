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