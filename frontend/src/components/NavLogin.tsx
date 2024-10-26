import React from 'react';
import carcare_cut from '../assets/images/carCare_logo_cut.png'

const NavLogin: React.FC = () => {
  return (
    
    <div className=" flex items-center justify-between  p-2 border-b border-black shadow-sm">
        <div className='w-10 h-4 mt-3 overflow-hidden'>
          <img src={carcare_cut} alt="carcare logo" className='w-full h-full object-cover' />
        </div>
        <button className='bg-maincol rounded px-2 py-1  font-semibold text-base text-white hover:bg-maincoldark transition-colors'>Home</button>
  </div>

  );
};

export default NavLogin;
