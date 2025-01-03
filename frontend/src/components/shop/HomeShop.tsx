import React, { useCallback, useEffect, useState } from "react";
import { navigateLogin, navigateLogout, navigateToSection } from "../utilities/navigate/common";
import { useLocation, useNavigate } from "react-router-dom";
import NavLogin from "../authenticate/NavLogin";
import {faCalculator,faCar,faChartBar,faLocationArrow,faMessage,faScrewdriverWrench,faUserCog,} from "@fortawesome/free-solid-svg-icons";
import ShopMain from "./MainShop";
import SidebarCRUD from "../reuseComponents/SidebarCRUD";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShopUser } from "../../features/shopSlice";
import { fetchShopUserDetails } from "../../services/shopService";
import { motion } from "framer-motion";


const ShopHome: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("Dash");
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigateLogout(navigate, "shop");
  };

  const sections = [
    { key: "Dash", label: "Dashboard", icon: faChartBar },
    { key: "VehicleManage", label: "Vehicles", icon: faCar },
    { key: "EstimateManage", label: "Estimate", icon: faCalculator },
    { key: "BookingManage", label: "Bookings", icon: faScrewdriverWrench },
    { key: "PickupManage", label: "Pickups", icon: faLocationArrow },
    { key: "ChatHistory", label: "Chats", icon: faMessage },
    { key: "ProfileEdit", label: "Profile", icon: faUserCog },
  ];

  const handleActiveSection = (section: string) => {
    navigateToSection(navigate,section,'shop')
    setShowMenu(!showMenu);
  };

  const toggleMenu = () => setShowMenu((prev) => !prev);
  
    const getShopData = useCallback(async () => {
        try {
          const response = await fetchShopUserDetails(navigate)
          if(!response || !response.data) throw new Error('canot find shop user details');
                dispatch(setShopUser(response.data.shopUser))
        } catch (error) {
          console.error('Failed to fetch shop data:', error);
          
        }
      },[dispatch])
  
      
      useEffect(() => {
        const token = localStorage.getItem("shop_access_token");
        if (!token) {
          navigateLogin(navigate, "shop");
        }
        getShopData()
  }, [navigate,activeSection]);

      useEffect(() => {
        const queryParmas = new URLSearchParams(location.search);
        const menuKey = queryParmas.get("menu");
        if (menuKey) {
          setActiveSection(menuKey);
        }
      }, [location.search]);


  return (
    <div className="flex flex-col">
      <NavLogin
        showBar={true}
        showMenu={showMenu}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
      />
      <ToastContainer />

      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/6 ">
          <div className="bg-mainclr-500 rounded-e-md flex-col items-start py-4 ps-4 text-white space-y-4  hidden md:flex  table-fixed h-screen sticky top-0">
            <SidebarCRUD
              title="Shop Panel"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
            />
          </div>
          <motion.div
          initial={{ x: "-100%" }} 
          animate={{ x: showMenu ? "0%" : "-100%" }} 
          exit={{ x: "-100%" }} 
          transition={{ duration: 0.5, ease: "easeInOut" }} 
          className="bg-mainclr-500 rounded-e-md flex flex-col items-start py-4 ps-4 text-white space-y-4 fixed z-10 left-0 top-0 h-full md:hidden w-3/5"
          >
             <SidebarCRUD
              title="Shop Panel"
              sections={sections}
              activeSection={activeSection}
              handleActiveSection={handleActiveSection}
              handleLogout={handleLogout}
              showMenu={showMenu}
            />
          </motion.div>
        </div>
        <ShopMain activeSection={activeSection} />
      </div>
    </div>
  );
};

export default ShopHome;
