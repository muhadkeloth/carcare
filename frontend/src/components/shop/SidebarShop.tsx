import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUserCog, faStore, faArrowRightFromBracket, faCar } from '@fortawesome/free-solid-svg-icons';
import { SidebarProps } from '../utilities/interface';



const SidebarShop:React.FC<SidebarProps> = ({ showMenu, handleActiveSection, handleLogout }) => {
  return (
    <div className='md:w-1/6'>
                   <div className="bg-maincol  flex-col items-start p-4 text-white space-y-4 hidden md:flex  table-fixed h-full">
                <h2 className="text-xl font-bold mb-6">Shop Management</h2>
                <nav className="flex flex-col space-y-4">
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark "
                        onClick={() => handleActiveSection('Dashboard')}
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark"
                        onClick={() => handleActiveSection('Vehicle Management')}
                    >
                        <FontAwesomeIcon icon={faCar} />
                        <span>Add Vehicle</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark"
                        onClick={() => handleActiveSection('Profile Management')}
                    >
                        <FontAwesomeIcon icon={faUserCog} />
                        <span>Profile</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark "
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Sidebar for small screens */}
            <div className={`bg-maincol flex flex-col items-start p-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:hidden w-3/5`}>
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="flex flex-col space-y-4">
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark"
                        onClick={() => handleActiveSection('Dashboard')}
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark"
                        onClick={() => handleActiveSection('Vehicle Management')}
                    >
                        <FontAwesomeIcon icon={faCar} />
                        <span>Add Vehicle</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark"
                        onClick={() => handleActiveSection('Profile Management')}
                    >
                        <FontAwesomeIcon icon={faUserCog} />
                        <span>Profile</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 hover:text-maincoldark  hover:underline"
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </div>
  )
}

export default SidebarShop