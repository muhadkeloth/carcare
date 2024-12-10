import { faArrowRight, faCalendar, faClock, faMapPin, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const BookingPanel:React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
    
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faCalendar} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Next Available</p>
          <p className="font-medium text-gray-900">Wed, Oct 13, 2024</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faClock} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Time Slot</p>
          <p className="font-medium text-gray-900">8:00 AM</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faMapPin} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium text-gray-900">Payyannur Taluk, Kerala</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faPhone} className='w-5 h-5 text-mainclr-500' />
        <div>
          <p className="text-sm text-gray-600">Contact</p>
          <p className="font-medium text-gray-900">345-315-3453</p>
        </div>
      </div>
    </div>

    <button className="btn-primary w-full">
      Book Appointment  <FontAwesomeIcon icon={faArrowRight}  />
    </button>
    
    <button className="w-full text-mainclr-600 py-3 px-4 rounded-lg font-medium mt-3 hover:bg-mainclr-50 transition-colors">
      Check Other Availability
    </button>

    <p className="text-sm text-gray-500 text-center mt-4">
      Free cancellation up to 24 hours before your appointment
    </p>
  </div>
  )
}

export default BookingPanel