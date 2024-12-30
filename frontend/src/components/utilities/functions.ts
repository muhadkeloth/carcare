import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { bookingStatus, Day, PaymentStatus, RatingData, Suggestion } from "./interface";
import { addDays, endOfMonth, endOfWeek, isAfter, isBefore, isSameDay, isSunday, startOfMonth, startOfWeek } from "date-fns";


export const getToken = (role: string) => {
  switch (role) {
    case 'user':
      return localStorage.getItem('user_token');
    case 'shop':
      return localStorage.getItem('shop_token');
    case 'admin':
      return localStorage.getItem('admin_token');
    default:
      return null;
  }
};

export const isAuthenticated = (role: string) => {
  return getToken(role) !== null;
};



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
    PAID: 'text-green-500 font-semibold ',
    FAILED: ' text-red-500 font-semibold',
    REFUNDED: ' text-gray-500 font-semibold',
    CONFIRMED:' text-blue-500 font-semibold',
    COMPLETED:' text-green-500 font-semibold',
    CANCELED:" text-red-500 font-semibold",
  };
  return colors[status] || '';
};

export const formatPhoneNumber = (phone:string) => {
  return `${phone.slice(0,3)}-${phone.slice(3,6)}-${phone.slice(6)}`;
}

export const formatTime = (time: string) => {
  const hours = parseInt(time.slice(0, 2));
  const suffix = hours < 12 ? 'AM' : 'PM';
  const formattedHours = hours > 12 ? hours - 12 : hours;
  const formattedTime = `${formattedHours}:${time.slice(3)} ${suffix}`;
  return formattedTime;
};

export const getNextAvailableDate = ():string => {
  const today = new Date();
  const nextAvailableDate = new Date(today);
  do{
    nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
  } while (nextAvailableDate.getDate() === 6 || nextAvailableDate.getDate() === 0);
  
  return nextAvailableDate.toLocaleDateString('en-US', {weekday:'short', month: 'short',day:'numeric'})
  // return nextAvailableDate.toLocaleDateString('en-US', {weekday:'short', month: 'short',day:'numeric',year:'numeric'})
}

export const getStatusMessageofShop = (opening: string,closing: string): { text: string; color: string } => {
  const today = new Date();
  const currentDay = today.getDay();
  const currentTime = today.getHours() * 60 + today.getMinutes();

  const openingTime = parseInt(opening.split(":")[0]) * 60 + parseInt(opening.split(":")[1]);
  const closingTime = parseInt(closing.split(":")[0]) * 60 + parseInt(closing.split(":")[1]);

  if (currentDay >= 1 && currentDay <= 5) {
    if (currentTime >= openingTime && currentTime <= closingTime) {
      return { text: "Open", color: "text-green-500" };
    } else {
      return { text: "Closed", color: "text-red-500" };
    }
  }

  return { text: "Closed", color: "text-red-500" };
};

export const generateCountsforChart = (period:'monthly'|'yearly'|'weekly', data:any[]) => {
  const counts = [];
  const now = new Date();

  let startDate,endDate,incrementFn,formatKey;
  if (period === 'yearly') {
    startDate = new Date(now.getFullYear() - 5, 0, 1);              
    endDate = new Date(now.getFullYear() + 1, 0, 1);                
    incrementFn = (date:Date) => date.setFullYear(date.getFullYear() + 1); 
    formatKey = (date:Date) => `${date.getFullYear()}`;
  } else if (period === 'weekly') {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7 * 6);                       
    endDate = new Date();
    endDate.setDate(now.getDate() + 7);                             
    incrementFn = (date:Date) => date.setDate(date.getDate() + 7);       
    formatKey = (date:Date) => {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
      return `${startOfWeek.getFullYear()}-W${Math.ceil((startOfWeek.getDate() + 6) / 7)}`;
    };
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1); 
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);   
    incrementFn = (date:Date) => date.setMonth(date.getMonth() + 1);     
    formatKey = (date:Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } 

  const date = new Date(startDate);

  while (date < endDate) {
    const key = formatKey(date);
    const item = data.find((d) => d._id === key);
    const count = item?.count ? 'count' : 'total'
    counts.push({ _id: key, [count]: item ? (item?.count || item?.total || 0) : 0 });
    incrementFn(date);
  }

  return counts;
}; 

export const mergeRatingCounts = (bookings:RatingData[],pickups:RatingData[]):RatingData[]=> {
  const ratingsMap = new Map<number,number>();
  bookings.forEach(({rating,count})=>{
    ratingsMap.set(rating,(ratingsMap.get(rating) || 0) + count);
  })
  pickups.forEach(({rating,count})=>{
    ratingsMap.set(rating,(ratingsMap.get(rating) || 0) + count);
  })
  // if need add star;
  return Array.from(ratingsMap.entries()).map(([rating,count])=>({rating,count}));
}

export const findtotalRating = (ratings:RatingData[]):string =>{
  const totalRating = ratings.reduce((sum,{rating,count})=> sum+rating*count,0)
  const totalResponses = ratings.reduce((sum,{count})=> sum+count,0)
  const totalPossibleRating = totalResponses * 5;
  if(totalPossibleRating === 0)return '0.00%';
  return `${((totalRating/totalPossibleRating)*100).toFixed(2)}%`;
}

export const formatToIndianNumbering = (number:number):string => {
  const numString = number.toString();
  const lastThreeDigits = numString.slice(-3);
  const otherDigits = numString.slice(0, -3);
  const formatted =
    otherDigits.length > 0
      ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits
      : lastThreeDigits;
  return formatted;
};

export const addTimeinDate = (selectedDate: Date, selectedTime: string): Date => {
  const [time, period] = selectedTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  const updatedDate:Date = new Date(selectedDate.getTime());
  updatedDate.setHours(hours)
  updatedDate.setMinutes(minutes);
  updatedDate.setSeconds(0);
  updatedDate.setMilliseconds(0);
  return updatedDate;
};