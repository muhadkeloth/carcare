import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faRupee, faX } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { ToastActive } from '../../utilities/functions';
import { confirmBooking } from '../../../services/userService';
import { HttpStatusCode } from '../../utilities/interface';

const Payment:React.FC<{ isOpen: boolean; closeModal: () => void }> = ({isOpen,closeModal}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const shopdetails = useSelector((state:RootState)=>{
        return state.estimate.estimateDetails 
        ? state.estimate.estimateDetails.shopdetails
        : state.bookingdetails.bookingDetails?.shopdetails;
      } );
      const { shedule, vehicleDetails ,userDetails } = useSelector((state: RootState) => state.bookingdetails.bookingDetails) || {};
      const { repairWork,locationdetails } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
    


    const handlePayment  = async () => {
        if(!stripe || !elements)return;
        const cardElement = elements.getElement(CardElement);
        if(!cardElement){
            setError('Card details are missing.');
            return;
        };
        try {
            setLoading(true);
            setError(null);

            const {token,error} = await stripe.createToken(cardElement);
            if(error){
                setError(error.message ||'payment error');
                setLoading(false);
                return
            }
            const bookingDetails = {
                shopId:shopdetails?._id,
                shedule,
                vehicleDetails,
                userDetails,
                amount:repairWork?.priceStart ? repairWork?.priceStart : 50,
                ...( repairWork && { repairWork }),
                ...( locationdetails && { locationdetails }),
            }
            const response = await confirmBooking(token,bookingDetails,'booking payment')
           
            if(response.status !== HttpStatusCode.SUCCESS)throw new Error('payment failed');

            ToastActive('success','payment successfull');
            setLoading(false);
            closeModal()
        } catch (error) {
            ToastActive('error','payment failed');
        }
    }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 relative">
        <button
          className="absolute top-4 right-4 text-xl cursor-pointer"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Confirm Payment
        </h2>
        <div className="flex mb-4 justify-between">
        <p className="">Payment Amount 
            <span className='text-xs text-gray-600'>{!repairWork?.priceStart && ' booking charge'}</span>
            </p>
        <p className="font-bold text-green-500">
            <FontAwesomeIcon icon={faIndianRupeeSign} />{' '} 
            {repairWork?.priceStart ? repairWork?.priceStart : '50' }
            </p>

        </div>
        <div className="mb-4">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full btn-primary disabled:bg-gray-300"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  )
}

export default Payment