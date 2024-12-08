import React, { useEffect, useState } from 'react'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import Footer from '../reusableComponents/Footer'
import Locationfind from './Locationfind'
import VehicleDetails from './ShopDetails'
import RepairService from './RepairService'
import FindEstimate from './FindEstimate'
import { navigateHome } from '../../utilities/navigate/common'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { clearbookingdetails } from '../../../features/bookingSlice'
import { clearestimateDetails } from '../../../features/estimateSlice'

const Estimate:React.FC = () => {
  const [activeSection, setActiveSection] = useState('Location')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
useEffect(() => {
  dispatch(clearbookingdetails())
  dispatch(clearestimateDetails())
},[])

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
          <li className={`${activeSection == 'Estimate' && 'cursor-pointer' } `} onClick={()=>activeSection == 'Estimate' && setActiveSection('RepairService')}>
          <h1 className={`font-semibold text-1xl ${activeSection === 'RepairService' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Repair Service</h1>
          </li>
          <li  >
          <h1 className={`font-semibold text-1xl ${activeSection === 'Estimate' ? 'text-mainclr-500 hover:text-mainclr-400' : 'text-gray-600 hover:text-gray-500' } `}>Estimate</h1>
          </li>
        </ul>
        
        <img src={carcare_logo} className="h-8" alt="carCare" />
      </nav>

      <div className="container flex flex-col max-w-6xl mx-auto px-4 mb-10  ">
  
        {activeSection === 'Location'  && < Locationfind setActiveSection={setActiveSection} />}
        {activeSection === 'Workshop'  && <VehicleDetails setActiveSection={setActiveSection} />}
        {activeSection === 'RepairService'  && <RepairService setActiveSection={setActiveSection} />}
        {activeSection === 'Estimate'  && <FindEstimate />}   
      </div>

      <Footer />
    </div>
  )
}

export default Estimate