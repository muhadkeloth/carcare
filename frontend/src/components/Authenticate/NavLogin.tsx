import React from 'react';
import carcare_cut from '../../assets/images/carCare_logo_cut.png'
import {  useNavigate  } from 'react-router-dom';
import { navigateHome } from '../utilities/navigate/common';

const NavLogin: React.FC = () => {
  const navigate = useNavigate();



  return (
    <header className=" flex items-center justify-between  p-2 border-b border-black shadow-sm">
      <div className="w-10 h-4 mt-3 overflow-hidden">
        <img src={carcare_cut} alt="carcare logo" className="w-full h-full object-cover" />
      </div>
      <button className="text-mainclr-600 rounded px-2 py-1  font-semibold text-base  hover:text-mainclr-700 hover:underline transition-colors"
        onClick={() => { navigateHome(navigate, "user");}} >
        Home
      </button>
    </header>
  );
};

export default NavLogin;
