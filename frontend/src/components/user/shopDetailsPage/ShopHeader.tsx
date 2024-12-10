import { faClock, faEnvelope, faMapPin, faPhone, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'


interface ShopHeaderProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
  }


const ShopHeader:React.FC<ShopHeaderProps> = ({ activeSection, onSectionChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'services', label: 'Services' },
        { id: 'reviews', label: 'Reviews' }
      ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container max-w-7xl mx-auto px-4">
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">PV Garagesz</h1>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className='text-yellow-400 ' />
            <span className="font-semibold">4.8</span>
            <span className="text-gray-500">(120+ reviews)</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faMapPin}  />
            <span>Payyannur Taluk, Kerala</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faClock} className='text-mainclr-500' />
            <span>10:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faPhone} className='text-mainclr-500' />
            <span>345-315-3453</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faEnvelope} className='text-mainclr-500' />
            <span>hydypu@cyclelove.cc</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-4 px-2 font-medium transition-colors relative ${
              activeSection === tab.id
                ? 'text-mainclr-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onSectionChange(tab.id)}
          >
            {tab.label}
            {activeSection === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-mainclr-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
  )
}

export default ShopHeader