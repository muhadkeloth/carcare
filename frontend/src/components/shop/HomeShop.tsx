import React, { useEffect, useState } from 'react'
import { navigateLogin, navigateLogout } from '../utilities/navigate/common';
import { useNavigate } from 'react-router-dom';
import NavLogin from '../authenticate/NavLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalculator, faCar, faChartBar, faUserCog } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from '../utilities/ProfileImage';
import ShopMain from './MainShop';
import SidebarCRUD from '../reuseComponents/SidebarCRUD';
import { ToastContainer } from 'react-toastify';


const ShopHome:React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('Dash');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigateLogout(navigate,'shop')
};

const sections = [
  { key: "Dash", label: "Dashboard", icon: faChartBar },
  { key: "VehicleManage", label: "Vehicles", icon: faCar },
  { key: "EstimateManage", label: "Estimate", icon: faCalculator },
  { key: "ProfileEdit", label: "Profile", icon: faUserCog },
];

  const handleActiveSection = (section: string) => {
    setActiveSection(section)
    setShowMenu(!showMenu)
};

const toggleMenu = () => setShowMenu((prev)=> !prev);

  useEffect(() => {
    const token = localStorage.getItem('shop_token');
    if(!token){ navigateLogin(navigate,'shop') }
  },[navigate])
  
  return (
    <div className="flex flex-col">
      <NavLogin showBar={true} showMenu={showMenu} toggleMenu={toggleMenu} handleLogout={handleLogout} />
      <ToastContainer />

      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/6 ">
          <div className="bg-mainclr-500 rounded-e-md flex-col items-start py-4 ps-4 text-white space-y-4 hidden md:flex  table-fixed h-full ">
            <SidebarCRUD 
                    title='Shop Panel'
                    sections={sections}
                    activeSection={activeSection} 
                    handleActiveSection={handleActiveSection} 
                    handleLogout={handleLogout} />
          </div>
          <div
            className={`bg-mainclr-500 rounded-e-md flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full transition-transform duration-300 ease-in-out ${
              showMenu ? "translate-x-0" : "-translate-x-full"
            } md:hidden w-3/5`} >
            <SidebarCRUD 
                    title='Shop Panel'
                    sections={sections}
                    activeSection={activeSection} 
                    handleActiveSection={handleActiveSection} 
                    handleLogout={handleLogout} 
                    showMenu={showMenu} />
            </div>
        </div>

        <ShopMain activeSection={activeSection} />
      </div>
    </div>
  );
}

export default ShopHome