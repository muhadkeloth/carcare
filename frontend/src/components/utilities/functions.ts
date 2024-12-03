import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Suggestion } from "../user/pickMyCar/Location";


// get Address from location
export const getAddressFromCoordinates = async (location:number[]) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${location[0]}&lon=${location[1]}&format=json`;
  
    try {
      const response = await axios.get(url);
      const { address } = response.data;
  
      return {
        street: address.road || address.neighbourhood || '',
        city: address.city || address.town || address.village || address.county || '',
        state: address.state || '',
        country: address.country || '',
        pincode: address.postcode || '',
      };
    } catch (error) {
      console.error('Error fetching location address:', error);
      return {street:'',city:'',state:'',country:'',pincode:''};
    }
  };

  export const ToastActive = (statusType: 'error' | 'success' | 'info' | 'warning',message:string) => {
     toast[statusType](message, {
      position: "bottom-right", autoClose: 3000,
      hideProgressBar: false, closeOnClick: true,
      pauseOnHover: true, draggable: true,
      progress: undefined, theme: "dark",
      transition: Bounce,
      })
  }

  // debounc
  export const debounce = (func:(...args: any[])=> void, delay:number) => {
    let timeout:NodeJS.Timeout;
    return (...args:any[])=>{
      clearTimeout(timeout);
      timeout = setTimeout(()=> func(...args),delay)
    }
  }

  export const fetchSuggestions = async(userInput:string):Promise<Suggestion[]> => {
    const apiKey =import.meta.env.VITE_OLA_AUTO_ADDRESS;
    try {
        const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete',{
          params:{
            input:userInput,
            api_key:apiKey,
          }
        })
        return response.data.predictions as Suggestion[];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
}

  
  