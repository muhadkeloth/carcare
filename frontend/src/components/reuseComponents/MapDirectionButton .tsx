import { faRoute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { motion } from 'framer-motion'
import { ZoomInMotionWrapper } from "./ui/MotionWrapper ";

interface MapDirectionButtonProps { 
    coordinates:[number, number]
};


const MapDirectionButton  = ({coordinates}:MapDirectionButtonProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`;
        window.open(directionsUrl,"_blank");
    }

    
  return (
    <div className="relative">
      {showTooltip && (
        <ZoomInMotionWrapper className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded">
          Get Directions
        </ZoomInMotionWrapper>
      )}

      <motion.button
        onClick={handleClick}
        className="btn-primary px-3 py-1 "
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{
          scale: 1.1,
          cursor: "pointer",
        }}
        animate={{
          y: [0, -10, 0], 
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <FontAwesomeIcon icon={faRoute} />
      </motion.button>
    </div>


  );
}

export default MapDirectionButton 