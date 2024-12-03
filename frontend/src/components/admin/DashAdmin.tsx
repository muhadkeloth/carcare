import React, { useEffect, useState } from 'react'
import NavLogin from '../authenticate/NavLogin'
import AdminMain from './MainAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars, faCar, faChartBar, faStore, faUserCog } from '@fortawesome/free-solid-svg-icons'
import ProfileImage from '../utilities/ProfileImage'
import { navigateLogin, navigateLogout } from '../utilities/navigate/common'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import SidebarCRUD from '../reuseComponents/SidebarCRUD'

const AdminDash: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('Dash');
    const navigate = useNavigate();

    const handleLogout = () => { navigateLogout(navigate,'admin') };
    const toggleMenu = () => setShowMenu((prev)=> !prev);
    
    const handleActiveSection = (section: string) => {
      setActiveSection(section);
      setShowMenu(!showMenu);
    };

    const sections = [
      { key: "Dash", label: "Dashboard", icon: faChartBar },
      { key: "UserManage", label: "User Management", icon: faUserCog },
      { key: "VehicleManage", label: "Vehicle Management", icon: faCar },
      { key: "ShopManage", label: "Shop Management", icon: faStore },
    ];


    useEffect(() => {
      const token = localStorage.getItem("admin_token");
      if (!token) navigateLogin(navigate, "admin");
    }, [navigate]);

  return (
    <div className="flex flex-col ">
      <NavLogin showBar={true} showMenu={showMenu} toggleMenu={toggleMenu} handleLogout={handleLogout} />
      <ToastContainer />

      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/6">
          <div className="bg-mainclr-500 rounded-e-md  flex-col items-start py-4 ps-4 text-white space-y-4 hidden md:flex  table-fixed h-full">
            <SidebarCRUD 
                title='Admin Panel' 
                sections={sections}
                activeSection={activeSection} 
                handleActiveSection={handleActiveSection} 
                handleLogout={handleLogout} />
          </div>
          <div
            className={`bg-mainclr-500 rounded-e-md flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full transition-transform duration-300 ease-in-out 
                ${showMenu ? "translate-x-0" : "-translate-x-full" } md:hidden w-3/5`} >
                  <SidebarCRUD 
                    title='Admin Panel'
                    sections={sections}
                    activeSection={activeSection} 
                    handleActiveSection={handleActiveSection} 
                    handleLogout={handleLogout} 
                    showMenu={showMenu} />
          </div>
        </div>

        <AdminMain activeSection={activeSection} />
      </div>
    </div>
  );
}

export default AdminDash