import {  useEffect, useState } from 'react'
import NavLogin from '../authenticate/NavLogin'
import AdminMain from './MainAdmin'
import { faBuilding, faCar, faChartBar, faChartLine, faStore, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { navigateLogin, navigateLogout } from '../utilities/navigate/common'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import SidebarCRUD from '../reuseComponents/SidebarCRUD'
import { motion } from 'framer-motion'

const AdminDash = () => {
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
      { key: "BookingBrockerage", label: "Booking Brokerage", icon: faBuilding },
      { key: "PickupBrockerage", label: "Pickup Brokerage", icon: faChartLine },
    ];



    useEffect(() => {
      const token = localStorage.getItem("admin_access_token");
      if (!token){
        navigateLogin(navigate, "admin");
      }
    }, [navigate]);

  return (
    <div className="flex flex-col ">
      <NavLogin
        showBar={true}
        showMenu={showMenu}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
      />
      <ToastContainer />

      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/6">
          <div className="bg-mainclr-500 rounded-e-md  flex-col items-start py-4 ps-4 text-white space-y-4 hidden md:flex  table-fixed h-full">
            <SidebarCRUD
              title="Admin Panel"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
            />
          </div>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: showMenu ? "0%" : "-100%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-mainclr-500 rounded-e-md flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full md:hidden w-3/5"
          >
            <SidebarCRUD
              title="Admin Panel"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
              showMenu={showMenu}
            />
          </motion.div>
        </div>
        <AdminMain activeSection={activeSection} />
      </div>
    </div>
  );
}

export default AdminDash