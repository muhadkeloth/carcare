import api from "./axiosConfig";


export interface Shop {
    _id: string;
    shopName: string;
    image: string;
    distance?: number;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    };
}

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