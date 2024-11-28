import axios from "axios";
import { Bounce, toast } from "react-toastify";


// get Address from location
export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  
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

  
  