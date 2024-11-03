import React, { useState } from 'react';
import carcare_cut from '../../assets/images/carCare_logo_cut.png'
import { useLocation, useNavigate, Location  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const NavLogin: React.FC = () => {
  const navigate = useNavigate();
  const location:Location = useLocation();
  const pathName:string = location.pathname.split('/')[1]

  const routetoHome = ():void =>{
    navigate('/');
  }




  return ( 
    <header className=" flex items-center justify-between  p-2 border-b border-black shadow-sm">
        <div className='w-10 h-4 mt-3 overflow-hidden'>
          <img src={carcare_cut} alt="carcare logo" className='w-full h-full object-cover' />
        </div>
        { pathName == 'admin' ? (<button className='text-maincol rounded px-2 py-1  font-semibold text-base  hover:text-maincoldark hover:underline transition-colors'
        >
          Logout</button>) : 
        (<button className='text-maincol rounded px-2 py-1  font-semibold text-base  hover:text-maincoldark hover:underline transition-colors'
        onClick={routetoHome}>
          Home</button>)
          }
  </header>
  );
};

export default NavLogin;
