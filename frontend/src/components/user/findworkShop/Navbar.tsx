import { faCity, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';
import { getAddressFromCoordinates } from '../../utilities/functions';
import { DropMotionWrapper, ZoomMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import {motion } from 'framer-motion'

interface Coordinates { coordinates:[number,number] | null ;}


const Navbar = ({coordinates}:Coordinates) => {
    const [pincode,setPincode] = useState<string|null>(null);
    const [city,setCity] = useState<string|null>(null);

    useEffect(() => {
        const fetchLocationAddress = async () => {
            if(!coordinates) return;
            const { pincode, street, city } = await getAddressFromCoordinates(coordinates)
            setPincode(pincode ?? null);
            setCity(street?.trim() || city?.trim() || null);
        };
        fetchLocationAddress();
    });

  return (
    <nav className=" p-6 pb-0 bg-white  border-b shadow-md sticky top-0 z-0 ">
      <DropMotionWrapper>
        <h5 className="font-semibold text-4xl">Auto Repair Shops Near Me</h5>
      </DropMotionWrapper>
      <ul className="flex flex-wrap gap-2 px-1 py-4 mt-4">
        {pincode && (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ZoomMotionWrapper>
              <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-slate-600"
                />{" "}
                {pincode}
              </button>
            </ZoomMotionWrapper>
          </motion.li>
        )}
        {city && (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ZoomMotionWrapper>
              <button className="py-1 px-3 border border-slate-500 rounded-full text-sm ">
                <FontAwesomeIcon icon={faCity} className="text-slate-600" />{" "}
                {city}
              </button>
            </ZoomMotionWrapper>
          </motion.li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar