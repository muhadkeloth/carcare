import React, { useEffect, useState } from 'react'
import Footer from '../reusableComponents/Footer'
import { navigateHome } from '../../utilities/navigate/common'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import Location from './Location'
import WorkShop from './WorkShop'
import Vehicle from './Vehicle'
import Summary from './Summary'
import Time from './Time'
import ContactInfo from './ContactInfo'
import { useDispatch } from 'react-redux'
import { clearPickCarDetails } from '../../../features/pickMyCarSlice'


const PickCarHome:React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Location')
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(clearPickCarDetails());
  },[]);

  return (
    <div className='min-h-screen'>
    <nav className="flex p-4 border-b justify-between">
      <button>
        <span onClick={()=>navigateHome(navigate, 'user')}
         className='font-semibold text-gray-700 cursor-pointer'><FontAwesomeIcon icon={faChevronLeft} /> Exit</span> 
      </button>
      <ul className="sm:flex gap-5 justify-center hidden items-center ">
          <li className='cursor-pointer' onClick={()=>setActiveSection('Location')} >
            <h1 className={`font-semibold text-1xl ${activeSection === 'Location' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' }  `}>Location</h1>
          </li>
          <li className={`${activeSection !== 'Location' && 'cursor-pointer' } `} onClick={()=>activeSection !== 'Location' && setActiveSection('Workshop')}>
          <h1 className={`font-semibold text-1xl ${activeSection === 'Workshop' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Work Shop</h1>
          </li>
          <li className={`${activeSection == 'Summary' && 'cursor-pointer' } `} onClick={()=>activeSection == 'Summary' && setActiveSection('Vehicle')}>
          <h1 className={`font-semibold text-1xl ${activeSection === 'Vehicle' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Vehicle</h1>
          </li>
          <li className={`${activeSection == 'Summary' && 'cursor-pointer' } `} onClick={()=>activeSection == 'Summary' && setActiveSection('ContactInfo')}>
          <h1 className={`font-semibold text-1xl ${activeSection === 'ContactInfo' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Contact Info</h1>
          </li>
          <li className={`${activeSection == 'Summary' && 'cursor-pointer' } `} onClick={()=>activeSection == 'Summary' && setActiveSection('Time')}>
          <h1 className={`font-semibold text-1xl ${activeSection === 'Time' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Time</h1>
          </li>
          <li  >
          <h1 className={`font-semibold text-1xl ${activeSection === 'Summary' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Summary</h1>
          </li>
        </ul>
      <img src={carcare_logo} className="h-8" alt="carCare" />
    </nav>

    <div className="container flex flex-col max-w-6xl mx-auto px-4 mb-10  ">
      {activeSection === 'Location' && <Location  setActiveSection={setActiveSection} />}
      {activeSection === 'Workshop' && <WorkShop  setActiveSection={setActiveSection} />}
      {activeSection === 'Vehicle' && <Vehicle  setActiveSection={setActiveSection} />}
      {activeSection === 'ContactInfo' && <ContactInfo  setActiveSection={setActiveSection} />}          
      {activeSection === 'Time' && <Time  setActiveSection={setActiveSection} />}          
      {activeSection === 'Summary' && <Summary  setActiveSection={setActiveSection} />}          
    </div>

    <Footer />
  </div>
  )
}

export default PickCarHome