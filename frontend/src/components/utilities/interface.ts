
export interface RoleProps { role:string; }
export interface ErrorResponse { message:string; } 
export interface AdminMainProps { activeSection: string; }
export interface ShopMainProps { activeSection: string; }


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
    onLocationChange:(location:{latitude:number;longitude:number}) => void;
    initialPosition?:[number,number];
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

  export interface SidebarProps {
    activeSection: string;
    handleActiveSection: (section: string) => void;
    handleLogout?: () => void;
    children?: React.ReactNode;
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
  }
  image: string;
  // location: {latitude:number,longitude:number}; 
}

