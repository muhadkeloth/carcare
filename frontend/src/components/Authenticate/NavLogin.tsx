import React from 'react';
import carcare_cut from '../../assets/images/carCare_logo_cut.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';

interface NavLoginProps {
  showBar:boolean;
  showMenu?:boolean;
  toggleMenu?:() => void;
  handleLogout?: () => void;
}
const NavLogin: React.FC<NavLoginProps> = ({ showBar, showMenu,toggleMenu, handleLogout }) => {

  return (
    <header className=" flex items-center justify-between  p-2 border-b border-black shadow-sm">
      <div className="w-10 h-4 mt-3 overflow-hidden">
        <img src={carcare_cut} alt="carcare logo" className="w-full h-full object-cover" />
      </div>
      { showBar && (
        <>
        <button onClick={ toggleMenu }
          className="text-2xl text-mainclr-800 pe-2 md:hidden" >
              { showMenu ? (<FontAwesomeIcon icon={faArrowLeft} />)
              :(<FontAwesomeIcon icon={faBars} />)}
        </button>
        <p 
          onClick={handleLogout}
          className="text-mainclr-600 hover:text-mainclr-500 hidden md:block cursor-pointer">LogOut</p>
            </>
            )}
    </header>
  );
};

export default NavLogin;
