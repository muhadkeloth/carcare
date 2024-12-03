
export interface RoleProps { role:string; }
export interface ErrorResponse { message:string; } 
export interface SectionMainProps { activeSection: string; }


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
  
  export interface NewShop {
    shopName: string;
    ownerName: string;
    email: string;
    image: File | null;
    phoneNumber: string;
    location: string;
  }

  export interface User {
    _id: string;
    username: string;
    email: string;
    phoneNumber: string;
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
    priceStart:number |null ;
    priceEnd:number |null;
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


export interface Shop {
  _id:string;
  shopName: string;
  ownerName: string;
  email:string;
  phoneNumber: string
  isActive:boolean;
  address:{
    street:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
  };
  vehicleIds?: {
    brand:string;
    vehicleModelIds:string;
}[];
estimate?:{
  work:string;
  priceStart:number;
  priceEnd:number;
}[];
  image: string;
  location?: {
    type:string;
    coordinates:[number,number];
  }; 
}

