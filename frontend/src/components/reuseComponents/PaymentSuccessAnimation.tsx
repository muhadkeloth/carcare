import {motion} from 'framer-motion'
import Confetti from 'react-confetti'

const PaymentSuccessAnimation  = () => {
  return (
        <div className="flex flex-col items-center justify-center p-4 rounded-lg  bg-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
    
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-green-600 mt-4"
          >
            Payment Successful!
          </motion.h1>
    
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <ConfettiEffect />
          </motion.div>
        </div>
  )
}
const ConfettiEffect: React.FC = () => {
  return <Confetti width={window.innerWidth} height={window.innerHeight} />;
};

export default PaymentSuccessAnimation 