import { faArrowLeft, faArrowRightFromBracket, faCalculator, faCar, faChartBar, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { SidebarProps } from '../utilities/interface'


const SidebarShop:React.FC<SidebarProps> = ({ activeSection, handleActiveSection, handleLogout, showMenu }) => {
  return (
    <>
      <div className="flex w-full mb-6 pe-3 items-center justify-between">
        <h2 className="text-xl font-bold ">Shop Management</h2>
        {showMenu && ( <FontAwesomeIcon icon={faArrowLeft} onClick={() => handleActiveSection(activeSection)} /> )}
      </div>
      <nav className="flex flex-col w-full space-y-4 ">
        <button onClick={() => handleActiveSection("Dash")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "Dash" ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" }`} >
          <FontAwesomeIcon icon={faChartBar} />
          <span>Dashboard</span>
        </button>
        <button onClick={() => handleActiveSection("VehicleManage")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "VehicleManage" ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" }`} >
          <FontAwesomeIcon icon={faCar} />
          <span>Vehicles</span>
        </button>
        <button onClick={() => handleActiveSection("EstimateManage")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "EstimateManage" ? "text-mainclr-700 border-r-4 border-mainclr-900" : "" }`} >
          <FontAwesomeIcon icon={faCalculator} />
          <span>Estimate</span>
        </button>
        <button onClick={() => handleActiveSection("ProfileEdit")}
            className={`flex items-center space-x-2 hover:text-mainclr-200 ${
            activeSection == "ProfileEdit"? "text-mainclr-700 border-r-4 border-mainclr-900": ""}`} >
          <FontAwesomeIcon icon={faUserCog} />
          <span>Profile</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-mainclr-200 " onClick={handleLogout} >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}

export default SidebarShop