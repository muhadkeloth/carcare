import { faArrowRightFromBracket, faBars, faChartBar, faStore, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import ShopManagement from './ShopManagement';


interface AdminMainProps {
  activeSection: string;
}

const AdminMain: React.FC<AdminMainProps> = ({ activeSection }) => {
  return (
    <div className="flex-1 h-screen p-6 bg-gray-100">
        {activeSection === 'Dashboard' && <Dashboard />}
        {activeSection === 'User Management' && <UserManagement />}
        {activeSection === 'Shop Management' && <ShopManagement />}

    </div>
  )
}



export default AdminMain