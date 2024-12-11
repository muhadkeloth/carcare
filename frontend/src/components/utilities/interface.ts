
// export interface RoleProps { role:string; }
// export interface ErrorResponse { message:string; } 
// export interface SectionMainProps { activeSection: string; }


// export enum HttpStatusCode {
//   SUCCESS = 200,
//   CREATED = 201,  
//   BAD_REQUEST = 400,
//   UNAUTHORIZED = 401,
//   FORBIDDEN = 403,
//   NOT_FOUND = 404,
//   INTERNAL_SERVER_ERROR = 500,
// }

// export interface errorProps {
//   role:'user'|'admin'|'shop';
// }

// export type RouteProps = {
//   destination: [number, number];
// };

// export interface LocationPickerProps {
//     onLocationChange?:(location:[number,number]) => void;
//     initialPosition?:[number,number]| null;
//     hoverLocation?:[number,number]| null;
//     hoverDetails?:{image:string;shopName:string;address:any}|null;
// }

// export interface SidebarProps {
//   activeSection: string;
//   handleActiveSection: (key: string) => void;
//   children?: React.ReactNode;
// }

// export interface CRUDbarProps {
//   title:string;
//   sections:{
//     key:string;
//     label:string;
//     icon:any;
//   }[];
//   handleLogout?: () => void;
//   showMenu?:boolean;
// }

// export interface paymentProps { 
//   isOpen: boolean; 
//   closeModal: () => void ;
//   methodofBooking:'booking' | 'pickup' ;
//   bookingDetails:{
//     shopdetails?:Shop;
//     shedule?:{date:Date;time:string;}; 
//     vehicleDetails?:{make:string;model:string;year:string;description?:string;};
//     userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
//     repairWork?:{work:string;priceStart:number;priceEnd:number} | null;
//     locationdetails?:{ description:string; location:[number,number];};
//   }
// }

// export interface TableProps{
//   headers:{label:string; key: string}[];
//   data:any[];
//   renderActions?:(item:any)=> JSX.Element;
//   onRowClick?:(rowData: any) => void;
// }


// export interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title: string;
// }

// export interface OrderDetailsProps {
//   order?: Order;
// pickupsDetails?: PickupsDetails;
// handlesetPickupData?:(updatedPickpDetails:any) => void;
// }

// export interface OrderTableProps {
//   orders: Order[];
// }

// export interface DropOffProps {//update name herer
// setActiveSection:React.Dispatch<React.SetStateAction<string>>;
// }

// export interface TimeSlotProps {
//   selectedTime: string | null;
//   setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
// }

// export interface estimateProps {
//   setActiveSection:React.Dispatch<React.SetStateAction<string>>;
// }








  
//   export interface NewShop {
//     shopName: string;
//     ownerName: string;
//     email: string;
//     image: File | null;
//     phoneNumber: string;
//     location: string;
//   }

  

//   export interface User {
//     _id: string;
//     username: string;
//     email: string;
//     phoneNumber: string;
//     isActive: boolean ;
//   }

//   export interface Vehicle {
//     _id?:string;
//     brand:string;
//     vehicleModel:string[];
//   }

//   export interface Estimate {
//     _id?:string;
//     work:string;
//     priceStart:number |null ;
//     priceEnd:number |null;
//   }


  
  



// export interface Shop {
//   _id:string;
//   shopName: string;
//   ownerName: string;
//   email:string;
//   phoneNumber: string
//   isActive:boolean;
//   address:{
//     street:string;
//     city:string;
//     state:string;
//     country:string;
//     pincode:string;
//   };
//   vehicleIds?: {
//     brand:string;
//     vehicleModelIds:string;
// }[];
// estimate?:{
//   work:string;
//   priceStart:number;
//   priceEnd:number;
// }[];
//   image: string;
//   location?: {
//     type:string;
//     coordinates:[number,number];
//   }; 
// }

// export interface PickupsDetails {//chagne name to pickup and booking
//   _id:string;
//   userId:{
//     _id:string;
//     username:string;
//     email:string;
//     image:string;
//     phoneNumber:string;
//   };
//   locationdetails?:{
//       description:string;
//       location:[number,number];
//   };
//   amount:number;
//   paymentStatus:string;
//   status:string;
//   vehicleDetails?:{make:string;model:string;year:string;description?:string;};
//   shedule?:{date:string;time:string;};
//   repairWork?:string;
//   userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
// }




// export interface VehicleDetails {
//   make: string;
//   model: string;
//   year: number;
//   description?: string;
// }

// export interface UserDetails {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
// }

// export interface LocationDetails {
//   description: string;
//   coordinates: [number, number];
// }


// // export type RepairType = 'oil change' | 'brake service' | 'tire rotation' | 'general maintenance';
// export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// export interface Order {
//   id: string;
//   vehicleDetails: VehicleDetails;
//   userDetails: UserDetails;
//   locationDetails?: LocationDetails;
//   repairWork?: string;
//   paymentStatus: PaymentStatus;
//   amount: number;
//   date: string;
// }



// export interface shopdetails {
//   shopName:string;ownerName:string;
//   email:string;image:string;
// }

// export type Day = {
//   date:Date;
//   isDisabled:boolean;
//   isToday:boolean;
//   isSelected:boolean;
// };


// export interface Suggestion {
//   geometry:{
//       location:{lng:number;lat:number};
//   };
//   description: string;
// }







// // slice
// export type bookingDetailsType = {
//   shopdetails?:Shop;
//   shedule?:{date:Date;time:string;};
//   vehicleDetails?:{make:string;model:string;year:string;description?:string;};
//   userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
// }

// export interface bookingState {
//   bookingDetails:bookingDetailsType | null,
// } 

// export type estimatetype = {
//   locationdetails?:{
//       description:string;
//       location:[number,number];
//   };
//   vehicleDetails?:{make:string;model:string;year:string;description?:string;};
//   shopdetails?:Shop;
//   repairWork?:{work:string;priceStart:number;priceEnd:number};
// }

// export interface estimateState {
//   estimateDetails:estimatetype | null,
// }

// export type userdetail = {username:string;phoneNumber:string;email:string; password?:string;confirmPassword?:string;otp?:string}
// export interface OtpState {
//     signupDetails:userdetail | null;
// };

// export type pickCartype = {
//   locationdetails?:{
//       description:string;
//       location:[number,number];
//   };
//   vehicleDetails?:{make:string;model:string;year:string;description?:string;};
//   shopdetails?:Shop;
//   shedule?:{date:Date;time:string;};
//   userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
// }

// export interface PickCarState {
//   PickCarDetails:pickCartype | null,
// }

// export type shopProfile = {
//   _id:string;shopName:string;
//   ownerName:string;email:string;
//   phoneNumber:string;image:string;
//   isActive:boolean;location:{type:string;coordinates:[number,number]};
//   address:{
//       street:string;city:string;
//       state:string;country:string;pincode:string;
//   };
//   about?:string;
//   discription?:{title:string;discript:string};
//   workingTime?:{opening:string;closing:string};
// }
// export interface userState {
//   shopDetails:shopProfile | null,
// }

// export type userProfile = {
//   _id:string;
//   username:string;
//   phoneNumber:string;
//   email:string;
//   isActive:boolean;
//   role:string;
//   image:string;
// }



export interface RoleProps { role:string; }
export interface ErrorResponse { message:string; } 
export interface SectionMainProps { activeSection: string; }
export type RouteProps = {destination: [number, number];};


export enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,  
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}




export interface LocationPickerProps {
    onLocationChange?:(location:[number,number]) => void;
    initialPosition?:[number,number]| null;
    hoverLocation?:[number,number]| null;
    hoverDetails?:{image:string;shopName:string;address:any}|null;
}

export interface SidebarProps {
  activeSection: string;
  handleActiveSection: (key: string) => void;
  children?: React.ReactNode;
}

export interface CRUDbarProps {
  title:string;
  sections:{
    key:string;
    label:string;
    icon:any;
  }[];
  handleLogout?: () => void;
  showMenu?:boolean;
}



export interface TableProps{
  headers:{label:string; key: string; className?:string}[];
  data:any[];
  renderActions?:(item:any)=> JSX.Element;
  onRowClick?:(rowData: any) => void;
}


export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export interface BookingDetailsProps {
  booking?: Bookings;
  bookingDetails?: PickupsDetails;
  handlesetPickupData?:(updatedPickpDetails:any) => void;
}

export interface BookingTableProps {
  bookings: Bookings[];
}

export interface BookingProps {//update name herer
setActiveSection:React.Dispatch<React.SetStateAction<string>>;
}

export interface TimeSlotProps {
  selectedTime: string | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
}





interface ProfileDoc {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  image:string;
};

export interface User extends Omit<ProfileDoc, 'image'> {
  isActive: boolean ;
}


export interface Vehicle {
  _id?:string;
  brand:string;
  vehicleModel:string[];
}

export interface Estimate {
  _id?:string;
  work:string;
  priceStart?:number |null ;
  priceEnd?:number |null;
}



export interface BaseShop {
  shopName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  image:string;
}

interface Address {
  street:string;
  city:string;
  state:string;
  country:string;
  pincode:string;
};

  
  export interface NewShop extends Omit<BaseShop,'image'> {
    image: File | null;
    location: string;
  }

export interface Shop extends BaseShop {
  _id:string;
  isActive:boolean;
  address:Address;
  vehicleIds?: {
    brand:string;
    vehicleModelIds:string;
}[];
estimate?:Estimate[];
  location?: Location; //check
  about?:string;
  discription?:{title:string,discript:string};
  workingTime?:{opening:string,closing:string};
}



export interface PickupsDetails extends Omit<BookingDetails,"shopdetails" | 'repairWork'> { //chagne name to pickup and booking
  _id:string;
  shopId?:string | Shop;
  userId:ProfileDoc;
  amount:number;
  paymentStatus:string;
  status:string;
  repairWork?:string;
  paymentFailDetails?:paymentFailDetails;
}




export interface VehicleDetails {
  make: string;
  model: string;
  year: string;
  description?: string;
}

export interface shedule {
  date:Date | string;
  time:string;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface LocationDetails {
  description: string;
  coordinates: [number, number];
}

export interface Location {
  type: string;
  coordinates: [number, number];
}


export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type bookingStatus = 'PENDING' | 'CONFIRMED' | 'PICKED' | 'CANCELLED';

export interface Bookings {
  id: string;
  vehicleDetails: VehicleDetails;
  userDetails: UserDetails;
  locationDetails?: LocationDetails;
  repairWork?: string;
  paymentStatus: PaymentStatus;
  amount: number;
  date: string;
}

interface paymentFailDetails{
  reason:string;
  actionFrom:string;
}

export type Day = {
  date:Date;
  isDisabled:boolean;
  isToday:boolean;
  isSelected:boolean;
};


export interface Suggestion {
  geometry:{location:{lng:number;lat:number};};
  description: string;
}

export interface paymentProps { 
  isOpen: boolean; 
  closeModal: () => void ;
  methodofBooking:'booking' | 'pickup' ;
  bookingDetails:BookingDetails;
}

interface BookingDetails extends bookingDetailsType {
  _id?:string;
  repairWork?:Estimate | null ;
  locationdetails?:LocationDetails;
}




// ********************************************
// slice
export type bookingDetailsType = {
  shopdetails?:Shop;
  shedule?:shedule; 
  vehicleDetails?:VehicleDetails;
  userDetails?:UserDetails;
}

export interface bookingState {
  bookingDetails:bookingDetailsType | null,
} 

export type estimatetype = {
  shopdetails?:Shop;
  vehicleDetails?:VehicleDetails;
  locationdetails?:LocationDetails;
  repairWork?:Estimate;
}

export interface estimateState {
  estimateDetails:estimatetype | null,
}

export type userdetail = {
  username:string;
  email:string; 
  phoneNumber:string;
  password?:string;
  confirmPassword?:string;
  otp?:string
}

export interface OtpState {
    signupDetails:userdetail | null;
};

export type pickCartype = {
  locationdetails?:LocationDetails;
  vehicleDetails?:VehicleDetails;
  shopdetails?:Shop;
  shedule?:shedule;
  userDetails?:UserDetails;
}

export interface PickCarState {
  PickCarDetails:pickCartype | null,
}

// export interface shopdetails {
//   shopName:string;
//   ownerName:string;
//   email:string;
//   image:string;
// }

export interface shopProfile extends BaseShop {
  _id:string;
  isActive:boolean;
  location?:Location;
  address:Address;
  about?:string;
  discription?:{title:string;discript:string};
  workingTime?:{opening:string;closing:string};
}
export interface userState {
  shopDetails:shopProfile | null,
}

export interface userProfile extends ProfileDoc {
  isActive:boolean;
  role:string;
}
