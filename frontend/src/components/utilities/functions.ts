import axios from "axios";


// get Address from location
export const getAddressFromCoordinatesOSM = async (latitude: number, longitude: number) => {
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
  