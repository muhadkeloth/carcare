import { faArrowRightFromBracket, faCar, faChartBar, faKey, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { SidebarProps } from '../utilities/interface'


const SidebarShop:React.FC<SidebarProps> = ({ activeSection, handleActiveSection, handleLogout }) => {
  return (
    <>
         <h2 className="text-xl font-bold mb-6">Shop Management</h2>
                <nav className="flex flex-col w-full space-y-4">
                    <button
                        className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'Dash' ? 'text-gray-700 border-r-4 border-gray-700':''}`}
                        onClick={() => handleActiveSection('Dash')}
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'VehicleManage' ? 'text-gray-700 border-r-4 border-gray-700' : ''}`}
                        onClick={() => handleActiveSection('VehicleManage')}
                    >
                        <FontAwesomeIcon icon={faCar} />
                        <span>Add Vehicle</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 hover:text-maincoldark ${activeSection == 'ProfileEdit' ? 'text-gray-700 border-r-4 border-gray-700' : ''}`}
                        onClick={() => handleActiveSection('ProfileEdit')}
                    >
                        <FontAwesomeIcon icon={faUserCog} />
                        <span>Profile</span>
                    </button>
                    <button
                        className='flex items-center space-x-2 hover:text-maincoldark '
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        <span>Logout</span>
                    </button>
                </nav>
    </>
  )
}

export default SidebarShop