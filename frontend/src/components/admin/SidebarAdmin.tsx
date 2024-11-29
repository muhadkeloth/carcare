import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUserCog, faStore, faArrowRightFromBracket, faArrowLeft, faCar } from '@fortawesome/free-solid-svg-icons';
import { SidebarProps } from '../utilities/interface';



const SidebarAdmin:React.FC<SidebarProps> = ({ activeSection, handleActiveSection, handleLogout, showMenu }) => {
  return (
    <>
      <div className="flex w-full mb-6 pe-3 items-center justify-between">
        <h2 className="text-xl font-bold ">Admin Panel</h2>
        {showMenu && ( <FontAwesomeIcon icon={faArrowLeft} onClick={() => handleActiveSection(activeSection)} /> )}
      </div>

      <nav className="flex flex-col w-full space-y-4">
        <button onClick={() => handleActiveSection("Dash")}
          className={`flex items-center space-x-2 hover:text-mainclr-200 ${
          activeSection == "Dash" ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" } `} >
          <FontAwesomeIcon icon={faChartBar} />
          <span>Dashboard</span>
        </button>
        <button onClick={() => handleActiveSection("UserManage")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "UserManage"? "text-mainclr-700 border-r-4 border-mainclr-900": ""}`} >
          <FontAwesomeIcon icon={faUserCog} />
          <span>User Management</span>
        </button>
        <button onClick={() => handleActiveSection("VehicleManage")}
              className={`flex items-center space-x-2 hover:text-mainclr-200 ${
              activeSection == "VehicleManage" ? "text-mainclr-700 border-r-4 border-mainclr-900" : ""}`} >
          <FontAwesomeIcon icon={faCar} />
          <span>Vehicle Management</span>
        </button>
        <button onClick={() => handleActiveSection("ShopManage")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "ShopManage" ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" }`} >
          <FontAwesomeIcon icon={faStore} />
          <span>Shop Management</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-mainclr-200 " onClick={handleLogout} >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}

export default SidebarAdmin