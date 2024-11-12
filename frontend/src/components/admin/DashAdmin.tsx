import React, { useEffect, useState } from 'react'
import NavLogin from '../authenticate/NavLogin'
import AdminMain from './MainAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons'
import ProfileImage from '../utilities/ProfileImage'
import AdminSidebar from './SidebarAdmin'
import { navigateLogin, navigateLogout } from '../utilities/navigate/common'
import { useNavigate } from 'react-router-dom'

const AdminDash: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('Dash');
    const navigate = useNavigate();

    const handleLogout = () => {
      navigateLogout(navigate,'admin')
  };

  const handleActiveSection = (section: string) => {
      // Your logic to set the active section
      setActiveSection(section)
      setShowMenu(!showMenu);
      console.log('Active section:', section);
  };

useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if(!token) navigateLogin(navigate,'admin')
},[navigate])

  return (
 <div className="flex flex-col ">

    <NavLogin />
    <div className="flex justify-between items-center my-1 ">
        <button onClick={() => console.log("Go back")} className="text-2xl text-maincol ps-2">
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <ProfileImage />
        <button onClick={() => setShowMenu(!showMenu)} className="text-2xl text-maincol pe-2 md:hidden">
            <FontAwesomeIcon icon={faBars} />
        </button>
    </div>

<div className="flex flex-col md:flex-row min-h-screen">

    <div className='md:w-1/6'>
        <div className="bg-maincol  flex-col items-start py-4 ps-4 text-white space-y-4 hidden md:flex  table-fixed h-full">
        <AdminSidebar activeSection={activeSection} handleActiveSection={handleActiveSection} handleLogout={handleLogout} /> 
        </div>
        <div className={`bg-maincol flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:hidden w-3/5`}>
        <AdminSidebar activeSection={activeSection} handleActiveSection={handleActiveSection} handleLogout={handleLogout} /> 
        </div>
    </div>

    <AdminMain activeSection={activeSection} />
</div>

</div>
  );
}

export default AdminDash