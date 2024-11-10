
export interface RoleProps { role:string; }
export interface ErrorResponse { message:string; } 
export interface AdminMainProps { activeSection: string; }
export interface ShopMainProps { activeSection: string; }

export interface LocationPickerProps {
    onLocationChange:(location:{latitude:number;longitude:number}) => void;
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
    vehicleModel:string;
    year:number[];
  }

  export interface SidebarProps {
    showMenu: boolean;
    handleActiveSection: (section: string) => void;
    handleLogout: () => void;
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

