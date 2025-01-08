import { Message, onlineUser } from "./types";

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


export interface HoverDetails {
  image:string;
  shopName:string;
  address:any
}

export interface LocationPickerProps {
    onLocationChange?:(location:[number,number]) => void;
    initialPosition?:[number,number][]| null;
    hoverLocation?:[number,number]| null;
    hoverDetails?: HoverDetails | null;
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

export interface BookingProps {
setActiveSection:React.Dispatch<React.SetStateAction<string>>;
}

export interface TimeSlotProps {
  selectedTime: string | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
  wokingTime?:{opening:string,closing:string}
  reservedTimes?:string[];
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

  interface Rating {
    ratingSum:number;
    count:number;
  }

export interface Shop extends BaseShop {
  _id:string;
  isActive:boolean;
  address:Address;
  vehicleIds?: {
    brand:string;
    vehicleModel:string[];
}[];
estimate?:Estimate[];
  location?: Location; 
  about?:string;
  rating?:Rating;
  discription?:{title:string,discript:string};
  workingTime?:{opening:string,closing:string};
}

interface Review{
  rating:number;
  feedback?:string;

}


export interface PickupsDetails extends Omit<BookingDetails,"shopdetails" | 'repairWork'> { 
  _id:string;
  shopId?:string | Shop;
  userId:ProfileDoc;
  amount:number;
  paymentStatus:string;
  status:string;
  repairWork?:string;
  review?:Review;
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
export type bookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

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

export interface Reviews {
  _id?:string;
  review:Review;
  userId:{
    username:string;
    image:string;
  };
  updatedAt:Date;
}

export type Period = 'monthly'|'yearly'|'weekly';

export interface RatingData{
  rating:number;
  count:number;
}

export interface StatusAnalytics {
  COMPLETED:number;
  CANCELED:number;
  PENDING:number
}


// ********************************************

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


export interface shopProfile extends BaseShop {
  _id:string;
  isActive:boolean;
  location?:Location;
  address:Address;
  about?:string;
  rating?:Rating;
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

export interface ChatState {
  messages:Message[];
  chats:any[];
  activeChat:string | null;
  onlineUsers:onlineUser[],
  Notification:[];
}