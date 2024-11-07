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
    const [activeSection, setActiveSection] = useState('Dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
      navigateLogout(navigate,'admin')
  };

  const handleActiveSection = (section: string) => {
      // Your logic to set the active section
      setActiveSection(section)
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

<div className="flex flex-col md:flex-row h-screen">

    <AdminSidebar
    showMenu={showMenu}
    handleActiveSection={handleActiveSection}
    handleLogout={handleLogout}
/> 
    <AdminMain activeSection={activeSection} />
</div>

</div>
  );
}

export default AdminDash