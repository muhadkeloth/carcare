import React from 'react'
import Dashboard from './mainblock/Dash/Dashboard';
import UserManagement from './mainblock/UserManage/UserManagement';
import ShopManagement from './mainblock/shopManage/ShopManagement';
import { AdminMainProps } from '../utilities/interface';



const AdminMain: React.FC<AdminMainProps> = ({ activeSection }) => {
  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100">
        {activeSection === 'Dash' && <Dashboard />}
        {activeSection === 'UserManage' && <UserManagement />}
        {activeSection === 'ShopManage' && <ShopManagement />}
    </div>
  )
}



export default AdminMain