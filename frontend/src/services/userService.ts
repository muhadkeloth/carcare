import { Shop } from "../components/utilities/interface";
import api from "./axiosConfig";


export const fetchNearbyShops = async (latitude:number,longitude:number):Promise<Shop[]> => {
    try{
        const {data} = await api.get('/getnearshops', {
            params: { latitude, longitude },
        });
        return data.shops;
    }catch(error){
        console.error("Error fetching nearby shops:", error);
        throw new Error("Unable to fetch nearby shops.");
    }
}

export const fetchUserData = async ():Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get('/userdetails')
       return {status:response.status,data:response.data}
    } catch (error) {
        console.error("Error fetching nearby user detail:", error);
        throw new Error("Unable to fetch nearby user detail.");
    }
}

export const fetchShopData = async (id:string):Promise<{status:number,data:any}> => {
    try {
       const response =  await api.get(`/shopdetails/${id}`)
       return {status:response.status,data:response.data}
    } catch (error) {
        console.error("Error fetching nearby user detail:", error);
        throw new Error("Unable to fetch nearby user detail.");
    }
}

