
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
    _id: number;
    username: string;
    email: string;
    phoneNumber: string;
    isActive: boolean ;
  }

  export interface AdminSidebarProps {
    showMenu: boolean;
    handleActiveSection: (section: string) => void;
    handleLogout: () => void;
}

