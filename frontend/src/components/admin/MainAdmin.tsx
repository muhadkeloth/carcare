import React from 'react'
import Dashboard from './mainblock/Dash/Dashboard';
import UserManagement from './mainblock/UserManage/UserManagement';
import ShopManagement from './mainblock/shopManage/ShopManagement';
import { SectionMainProps } from '../utilities/interface';
import VehicleManagement from './mainblock/vehicleManage/VehicleManagement';



const AdminMain: React.FC<SectionMainProps> = ({ activeSection }) => {
  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100">
        {activeSection === 'Dash' && <Dashboard />}
        {activeSection === 'UserManage' && <UserManagement />}
        {activeSection === 'ShopManage' && <ShopManagement />}
        {activeSection === 'VehicleManage' && <VehicleManagement />}
    </div>
  )
}



export default AdminMain