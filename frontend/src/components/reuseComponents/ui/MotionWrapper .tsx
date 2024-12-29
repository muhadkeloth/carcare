import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
    children: ReactNode; 
    className?: string;   
  }

const MotionWrapper = ({children, className}:MotionWrapperProps) => {
    return (
      <motion.div
        className={className ?? ''}
        whileHover={{ scale: 1.01 }}
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    );
}

export const DropMotionWrapper = ({children, className}:MotionWrapperProps) => {
    return (
      <motion.div
        className={className ?? ''}
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{once:true}}
        // exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
}

export const HoverMotionWrapper = ({children, className}:MotionWrapperProps) => {
    return (
      <motion.div
        className={className ?? ''}
        whileHover={{ scale: 1.05 }}
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    );
}

export const ZoomMotionWrapper = ({children, className}:MotionWrapperProps) => {
    return (
      <motion.div
        className={className ?? ''}
        initial={{  scale: 1.2, opacity: 0 }}
        whileInView={{  scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    );
}

export const ZoomInMotionWrapper = ({children, className}:MotionWrapperProps) => {
    return (
      <motion.div
        className={className ?? ''}
        initial={{  scale: 0.8, opacity: 0 }}
        whileInView={{  scale: 1, opacity: 1 }}
        // whileHover={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
}

export default MotionWrapper;

// initial={{ y: 50, opacity: 0 }}
// animate={{ y: 0, opacity: 1 }}
// transition={{ duration: 0.4 }}
