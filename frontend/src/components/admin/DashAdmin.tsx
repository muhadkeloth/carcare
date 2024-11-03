import React, { useState } from 'react'
import NavLogin from '../authenticate/NavLogin'
import AdminMain from './MainAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons'
import ProfileImage from '../utilities/ProfileImage'
import AdminSidebar from './SidebarAdmin'

const AdminDash: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('Dashboard');


    const handleLogout = () => {
      // Add your logout logic here
      console.log('Logging out...');
  };

  const handleActiveSection = (section: string) => {
      // Your logic to set the active section
      setActiveSection(section)
      console.log('Active section:', section);
  };



    
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