import React, { useEffect, useState } from 'react'
import SidebarCRUD from '../../reuseComponents/SidebarCRUD'
import { useLocation, useNavigate,  } from 'react-router-dom';
import { navigateLogout } from '../../utilities/navigate/common';
import { faKey, faScrewdriverWrench, faLocationArrow, faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from '../reusableComponents/Header';
import ProfileMain from './ProfileMain';
import { ToastContainer } from 'react-toastify';

const ProfileHome:React.FC = () => {
    const [showMenu,setShowMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const location = useLocation();
    const navigate = useNavigate()

    const handleLogout = () => {
        navigateLogout(navigate,'user')
    }

    const sections = [
        { key:"profile", label:"Profile", icon: faUser },
        { key:"bookings", label:"bookings Manage", icon: faScrewdriverWrench },
        { key:"pickups", label:"pickups Manage", icon: faLocationArrow },
        { key:"editProfile", label:"Edit Profile", icon: faPencil },
        { key:"changePassword", label:"Change Password", icon: faKey },
    ]

    const handleActiveSection = (key: string) => {
        setActiveSection(key);
        setShowMenu(!showMenu)
    }

    useEffect(()=>{
      const queryParmas = new URLSearchParams(location.search);
      const menuKey = queryParmas.get('menu');
      if(menuKey){
        setActiveSection(menuKey)
      }
    },[location.search])


  return (
    <div className="flex flex-col">
      <Header />
      <ToastContainer />

      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/6">
          <div className="bg-mainclr-500 rounded-e-md  flex-col items-start py-4 ps-4 text-white space-y-4 hidden md:flex  table-fixed h-full">
            <SidebarCRUD
              title="User Panel"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
            />
          </div>
          <div className={`bg-mainclr-500 rounded-e-md flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full transition-transform duration-300 ease-in-out 
                ${ showMenu ? "translate-x-0" : "-translate-x-full"} md:hidden w-3/5`} >
            <SidebarCRUD
              title="Profile"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
              showMenu={showMenu}
            />
          </div>
        </div>

        <ProfileMain activeSection={activeSection} />
      </div>
    </div>
  );
}

export default ProfileHome