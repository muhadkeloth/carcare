import { faArrowRight, faCalendar, faClock, faMapPin, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { formatPhoneNumber, formatTime, getNextAvailableDate } from '../../utilities/functions'
import { navigateBookingSlot } from '../../utilities/navigate/userNavigator'
import { useNavigate } from 'react-router-dom'
import { setShopdetails } from '../../../features/bookingSlice'

const BookingPanel:React.FC = () => {
  const shopDetails = useSelector((state:RootState) => state.shop.shopDetails );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAvailability = () => {
    if(!shopDetails)return;   
    dispatch(setShopdetails(shopDetails))
    navigateBookingSlot(navigate);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
    
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faCalendar} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Next Available</p>
          {/* <p className="font-medium text-gray-900">Wed, Dec 13, 2024</p> */}
          <p className="font-medium text-gray-900">{getNextAvailableDate()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faClock} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Time Slot</p>
          <p className="font-medium text-gray-900">{formatTime(shopDetails?.workingTime?.opening || '')} - {formatTime(shopDetails?.workingTime?.closing || '')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faMapPin} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium text-gray-900">{shopDetails?.address?.city.length !== 0 ? shopDetails?.address?.city : shopDetails?.address?.state }</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faPhone} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Contact</p>
          <p className="font-medium text-gray-900">{formatPhoneNumber(shopDetails?.phoneNumber || '')}</p>
        </div>
      </div>
    </div>

    <button className="btn-primary w-full" onClick={handleAvailability}>
      Book Appointment  <FontAwesomeIcon icon={faArrowRight}  />
    </button>
    
    <button onClick={handleAvailability}
    className="w-full text-mainclr-600 py-3 px-4 rounded-lg font-medium mt-3 hover:bg-mainclr-50 transition-colors">
      Check Other Availability
    </button>

    <p className="text-sm text-gray-500 text-center mt-4">
      Free cancellation up to 24 hours before your appointment
    </p>
  </div>
  )
}

export default BookingPanel