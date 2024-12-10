import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { bookingStatus, Day, PaymentStatus, Suggestion } from "./interface";
import { addDays, endOfMonth, endOfWeek, isAfter, isBefore, isSameDay, isSunday, startOfMonth, startOfWeek } from "date-fns";



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

export const generateDaysInMonth = (month:Date,selectedDate:Date | null): Day[] => {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days:Day[] = [];
  let date = start;

  while(!isAfter(date,end)){
      const isDisabled = isBefore(date, new Date()) || isSunday(date);
      const isToday = isSameDay(date,new Date());
      const isSelected = selectedDate ? isSameDay(date,selectedDate) : false;
      days.push({date,isDisabled,isToday, isSelected});
      date = addDays(date,1);
  }
  return days;
}

export const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    slots.push(`${adjustedHour}:${minute === 0 ? "00" : minute} ${period}`);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
};


export const formatDate = (isoDate: Date | undefined | string) => {
  if (!isoDate) return "";
  const dateObj = new Date(isoDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export   const getPaymentStatusColor = (status:bookingStatus|PaymentStatus) => {
  const colors = {
    PENDING: ' text-yellow-500 font-semibold',
    PAID: 'text-green-500 font-semibold inline-flex items-center justify-center',
    FAILED: ' text-red-500 font-semibold',
    REFUNDED: ' text-gray-500 font-semibold',
    CONFIRMED:' text-blue-500 font-semibold',
    PICKED:' text-green-500 font-semibold',
    CANCELLED:" text-red-500 font-semibold",
  };
  return colors[status] || '';
};
