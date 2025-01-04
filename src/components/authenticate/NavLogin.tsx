import carcare_cut from '../../assets/images/carCare_logo_cut.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';

interface NavLoginProps {
  showBar:boolean;
  showMenu?:boolean;
  toggleMenu?:() => void;
  handleLogout?: () => void;
}
const NavLogin = ({ showBar, showMenu,toggleMenu, handleLogout }:NavLoginProps) => {

  return (
    <header className=" flex items-center justify-between  p-2 border-b border-black shadow-sm">
      <div className="w-10 h-4 mt-3 overflow-hidden">
        <img
          src={carcare_cut}
          alt="carcare logo"
          className="w-full h-full object-cover"
        />
      </div>
      {showBar && (
        <>
          <button
            onClick={toggleMenu}
            className="text-2xl text-mainclr-800 pe-2 md:hidden"
          >
            <AnimatePresence mode="wait">
              {showMenu ? (
                <motion.div
                  key="close-icon"
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.div>
              ) : (
                <motion.div
                  key="open-icon"
                  initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <p
            onClick={handleLogout}
            className="text-mainclr-600 hover:text-mainclr-500 hidden md:block cursor-pointer"
          >
            LogOut
          </p>
        </>
      )}
    </header>
  );
};

export default NavLogin;
