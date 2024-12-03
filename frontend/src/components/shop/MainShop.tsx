import React from 'react'
import Dashboard from './mainblock/Dash/Dashboard';
import ShopProfile from './mainblock/ProfileManage/ShopProfile';
import {  SectionMainProps } from '../utilities/interface';
import VehicleManagement from './mainblock/VehicleManage/VehicleManagement';
import EstimateMangement from './mainblock/EstimateManage/EstimateMangement';




const ShopMain: React.FC<SectionMainProps> = ({ activeSection }) => {
  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100 ">
        {activeSection === 'Dash' && <Dashboard />}
        {activeSection === 'VehicleManage' && <VehicleManagement />}
        {activeSection === 'EstimateManage' && <EstimateMangement />}
        {activeSection === 'ProfileEdit' && <ShopProfile />}
    </div>
  )
}



export default ShopMain