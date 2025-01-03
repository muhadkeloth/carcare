import { faCalendarAlt, faCar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mechanic_working_in_garage from '../../../assets/images/mechanic_working_in_garage.png';
import { motion } from 'framer-motion'
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';

const Services = () => {
  return (
    <div
    className="max-w-7xl mx-auto px-4 py-12"
    style={{
      backgroundImage: `url(${mechanic_working_in_garage})`,
      backgroundAttachment: 'fixed', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-position 0.1s ease-out',
      minHeight: '50vh',
    }}
  >
    <motion.h2 
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{once:true}}
      transition={{ duration: 0.8, ease:"easeOut" }}
    className="text-3xl font-bold text-center mb-8 text-white">Our Services</motion.h2>
  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HoverMotionWrapper className="hover:shadow-lg bg-black bg-opacity-70 transition-shadow border border-gray-200 rounded-lg">
        <div className="p-6 text-white">
          <FontAwesomeIcon icon={faPlus} className="h-8 w-8 text-mainclr-600 mb-4" />
          <h3 className="font-semibold mb-2">Maintenance Service</h3>
          <p className="text-gray-300">
            Regular maintenance and repairs by certified mechanics
          </p>
        </div>
      </HoverMotionWrapper>
      <HoverMotionWrapper className="hover:shadow-lg bg-black bg-opacity-70 transition-shadow border border-gray-200 rounded-lg">
        <div className="p-6 text-white">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-mainclr-600 mb-4" />
          <h3 className="font-semibold mb-2">Easy Scheduling</h3>
          <p className="text-gray-300">Book your preferred time slot online</p>
        </div>
      </HoverMotionWrapper>
      <HoverMotionWrapper className="hover:shadow-lg bg-black bg-opacity-70 transition-shadow border border-gray-200 rounded-lg">
        <div className="p-6 text-white">
          <FontAwesomeIcon icon={faCar} className="h-8 w-8 text-mainclr-600 mb-4" />
          <h3 className="font-semibold mb-2">Pickup Service</h3>
          <p className="text-gray-300">Convenient doorstep pickup and delivery</p>
        </div>
      </HoverMotionWrapper>
    </div>
  </div>
  )
}

export default Services