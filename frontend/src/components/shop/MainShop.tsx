import React from 'react'
import Dashboard from './mainblock/Dash/Dashboard';
import ShopProfile from './mainblock/ProfileManage/ShopProfile';
import {  SectionMainProps } from '../utilities/interface';
import VehicleManagement from './mainblock/VehicleManage/VehicleManagement';
import EstimateMangement from './mainblock/EstimateManage/EstimateMangement';
import BookingManagement from './mainblock/BookingManage/BookingManagement';
import PickupManagement from './mainblock/PickupManage/PickupManagement';
import ChatHistory from './mainblock/Chats/ChatHistory';




const ShopMain: React.FC<SectionMainProps> = ({ activeSection }) => {

  const renderSection = () => {
    switch (activeSection){
      case 'VehicleManage':
        return <VehicleManagement />;
      case 'EstimateManage':
        return <EstimateMangement />;
      case 'BookingManage':
        return <BookingManagement />;
      case 'PickupManage':
        return <PickupManagement />;
      case 'ChatHistory':
        return <ChatHistory />;
      case 'ProfileEdit':
        return <ShopProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100 ">
       {renderSection()}
    </div>
  )
}



export default ShopMain