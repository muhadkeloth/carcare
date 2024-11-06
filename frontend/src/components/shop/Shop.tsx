import React, { useEffect, useState } from 'react'
import { navigateLogin, navigateLogout } from '../utilities/navigate/common';
import { useNavigate } from 'react-router-dom';
import NavLogin from '../authenticate/NavLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from '../utilities/ProfileImage';


const Shop:React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const navigate = useNavigate();

  const handleActiveSection = (section: string) => {
    setActiveSection(section)
    console.log('Active section:', section);
};

  useEffect(() => {
    const token = localStorage.getItem('shop_token');
    if(!token){ navigateLogin(navigate,'shop') }
  },[navigate])
  
  return (
    <div className="flex flex-col">
    <NavLogin />
    <div className="flex justify-between items-center my-1 ">
      <button
        onClick={() => console.log("Go back")}
        className="text-2xl text-maincol ps-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <ProfileImage />
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-2xl text-maincol pe-2 md:hidden"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>

    <div className="flex flex-col md:flex-row h-screen">
    </div>
  </div>
  )
}

export default Shop