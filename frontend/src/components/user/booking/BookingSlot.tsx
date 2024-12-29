import { faAngleRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import DropOff from './DropOff'
import Vehicle from './Vehicle'
import Summary from './Summary'
import ContactInfo from './ContactInfo'
import Footer from '../reusableComponents/Footer'
import {  useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ToastContainer } from 'react-toastify'
import useFetchUserData from '../reusableComponents/useFetchUserData'
import {  ZoomMotionWrapper } from '../../reuseComponents/ui/MotionWrapper '
import { navigateFindWorkShop } from '../../utilities/navigate/userNavigator'


const BookingSlot:React.FC = () => {
  const [activeSection, setActiveSection] = useState('DropOff')
  const navigate = useNavigate()
  const shopdetails = useSelector((state:RootState)=>{
    return state.estimate.estimateDetails 
    ? state.estimate.estimateDetails.shopdetails
    : state.bookingdetails.bookingDetails?.shopdetails;
  } );
  useFetchUserData();
  
useEffect(()=>{
  if(!shopdetails){
    navigateFindWorkShop(navigate)
  }
},[shopdetails,navigate])


  return (
    <div>
      <ToastContainer />
      <nav className="flex p-4 border-b justify-between">
        <button>
          <span
            // onClick={() => navigateHome(navigate, "user")}
            onClick={() => navigate(-1)}
            className="font-semibold text-gray-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Exit
          </span>
        </button>
        <h1 className="font-semibold text-3xl text-gray-700">
          {shopdetails?.shopName}
        </h1>
        <img src={carcare_logo} className="h-8" alt="carCare" />
      </nav>

      <div className="container flex flex-col max-w-6xl mx-auto px-4 mb-10  ">
        <div className="flex p-6 justify-center ">
          <ul className="flex  gap-4 items-center font-semibold text-sm text-gray-600">
            <li
              className={activeSection == "DropOff" ? "text-mainclr-600" : ""}
            >
              <ZoomMotionWrapper>
              Drop Off
              </ZoomMotionWrapper>
            </li>
            <FontAwesomeIcon icon={faAngleRight} />
            <li
              className={activeSection == "Vehicle" ? "text-mainclr-600" : ""}
            >
              <ZoomMotionWrapper>
              Vehicle
              </ZoomMotionWrapper>
            </li>
            <FontAwesomeIcon icon={faAngleRight} />
            <li
              className={
                activeSection == "ContactInfo" ? "text-mainclr-600" : ""
              }
            >
              <ZoomMotionWrapper>
              Contact Info
              </ZoomMotionWrapper>
            </li>
            <FontAwesomeIcon icon={faAngleRight} />
            <li
              className={activeSection == "Summary" ? "text-mainclr-600" : ""}
            >
              <ZoomMotionWrapper>
              Summary
              </ZoomMotionWrapper>
            </li>
          </ul>
        </div>

          {activeSection === "DropOff" && (
            <DropOff setActiveSection={setActiveSection} />
          )}
          {activeSection === "Vehicle" && (
            <Vehicle setActiveSection={setActiveSection} />
          )}
          {activeSection === "ContactInfo" && (
            <ContactInfo setActiveSection={setActiveSection} />
          )}
          {activeSection === "Summary" && (
            <Summary setActiveSection={setActiveSection} />
          )}
      </div>

      <Footer />
    </div>
  );
}

export default BookingSlot