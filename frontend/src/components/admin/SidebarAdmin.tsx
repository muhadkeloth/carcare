import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUserCog, faStore, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { SidebarProps } from '../utilities/interface';



const SidebarAdmin:React.FC<SidebarProps> = ({ activeSection, handleActiveSection, handleLogout }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col w-full space-y-4">
        <button
          className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'Dash' ? 'text-gray-700 border-r-4 border-gray-700':''} `}
          onClick={() => handleActiveSection("Dash")}
        >
          <FontAwesomeIcon icon={faChartBar} />
          <span>Dashboard</span>
        </button>
        <button
          className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'UserManage' ? 'text-gray-700 border-r-4 border-gray-700':''}`}
          onClick={() => handleActiveSection("UserManage")}
        >
          <FontAwesomeIcon icon={faUserCog} />
          <span>User Management</span>
        </button>
        <button
          className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'ShopManage' ? 'text-gray-700 border-r-4 border-gray-700':''}`}
          onClick={() => handleActiveSection("ShopManage")}
        >
          <FontAwesomeIcon icon={faStore} />
          <span>Shop Management</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-maincoldark "
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}

export default SidebarAdmin