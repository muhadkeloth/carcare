import { faCarBurst, faGaugeSimple, faGear, faMicrochip, faOilCan, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { DropMotionWrapper, ZoomMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';

const ShopServices:React.FC = () => {

    const services = [
        { 
          name: 'Engine Oil Change',
          priceRange: '₹500 - ₹1,000',
          icon: faOilCan,
          description: 'Complete oil change service with premium quality oils'
        },
        { 
          name: 'Diagnosis & Testing',
          priceRange: '₹1,000 - ₹1,200',
          icon: faMicrochip,
          description: 'Computer-aided diagnostic testing for accurate problem detection'
        },
        { 
          name: 'Noise Diagnosis',
          priceRange: '₹600 - ₹800',
          icon: faVolumeHigh,
          description: 'Expert diagnosis of unusual vehicle noises and vibrations'
        },
        { 
          name: 'Brake Service',
          priceRange: '₹1,000 - ₹2,000',
          icon: faCarBurst,
          description: 'Complete brake system inspection and repair'
        },
        { 
          name: 'Suspension Service',
          priceRange: '₹2,000 - ₹3,000',
          icon: faGear,
          description: 'Full suspension system check and replacement if needed'
        },
        { 
          name: 'Oil Leak Repair',
          priceRange: '₹1,000 - ₹5,000',
          icon: faGaugeSimple,
          description: 'Professional oil leak detection and repair service'
        }
      ];


  return (
    <section id="services" className="scroll-mt-24">
    <div className="bg-white rounded-xl shadow-sm p-6">
    <DropMotionWrapper>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
    </DropMotionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          return (
            <ZoomMotionWrapper
              key={index}
              className="flex gap-4 p-4 border rounded-xl hover:border-mainclr-500 transition-colors group"
            >
              <div className="p-3 bg-mainclr-50 rounded-xl group-hover:bg-mainclr-100 transition-colors">
                <FontAwesomeIcon icon={service.icon} className='w-6 h-6 text-mainclr-500' />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <p className="text-sm font-medium text-mainclr-600 mt-2">{service.priceRange}</p>
              </div>
            </ZoomMotionWrapper>
          );
        })}
      </div>
    </div>
  </section>
  )
}

export default ShopServices