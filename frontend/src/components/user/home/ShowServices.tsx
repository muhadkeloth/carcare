import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg_blue from '../../../assets/images/bg_blue.png';
import { faGear, faHeadset, faScrewdriverWrench, faStar, faTemperatureHigh, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import { motion } from 'framer-motion'


const ShowServices = () => {
  return (
    <div
    className="mt-0 w-full h-96 bg-cover bg-center"
    style={{ backgroundImage: `url(${bg_blue})` }}
  >
    <motion.h1 
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{once:true}}
    transition={{ duration: 0.8, ease:"easeOut" }}
    className="text-3xl pt-12 text-white font-bold md:text-6xl mb-2 text-center">
      One place for all your car needs.
    </motion.h1>
    <motion.p 
        initial={{ scale:0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{once:true}}
        transition={{ duration: 0.8, ease:"easeOut" }}
    className="mt-6 mb-9 text-xs md:text-lg pt-3 text-white font-light text-center">
      Get help with maintaining your vehicle, fixing problems, and more.
    </motion.p>

    <div className="flex justify-center items-center">
      <ul className="w-full max-w-4xl flex flex-wrap justify-center  gap-4 px-4">
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faScrewdriverWrench}  className="mr-2" /> Common Problems
          </li>
        </HoverMotionWrapper>
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faGear}  className="mr-2" /> Tires
          </li>
        </HoverMotionWrapper>
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faTemperatureHigh}  className="mr-2" /> Symptoms Guide
          </li>
        </HoverMotionWrapper>
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faStar}  className="mr-2" /> Reliability Ratings
          </li>
        </HoverMotionWrapper>
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faToolbox}  className="mr-2" /> Maintenance Schedule
          </li>
        </HoverMotionWrapper>
        <HoverMotionWrapper>
        <li className="text-white border rounded-full border-gray-300 py-1 px-3 text-center">
          <FontAwesomeIcon icon={faHeadset}  className="mr-2" /> Live Enquiry
          </li>
        </HoverMotionWrapper>
      </ul>
    </div>
  </div>
  )
}

export default ShowServices