import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { ToastActive } from '../../../../utilities/functions';
import { fetchUpdateProfileWorkTime } from '../../../../../services/shopService';
import { ThreeDots } from 'react-loader-spinner';

const WorkingTime:React.FC = () => {
  const shopUserDetails = useSelector((state:RootState)=> state.shop.shopDetails)
  const [openingTime, setOpeningTime] = useState<string>(shopUserDetails?.workingTime?.opening ||"09:00");
  const [closingTime, setClosingTime] = useState<string>(shopUserDetails?.workingTime?.closing || "17:00");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validateTimes = () => {
    if (!openingTime || !closingTime) {
      setError("Both opening and closing times are required.");
      return false;
    }
    const openingDate = new Date(`2000-01-01T${openingTime}:00`);
    const closingDate = new Date(`2000-01-01T${closingTime}:00`);
    if (closingDate < openingDate) {
      closingDate.setDate(closingDate.getDate() + 1);
    }

    const difference = (closingDate.getTime() - openingDate.getTime()) / (1000 * 60 * 60); 
    if (difference < 8) {
      setError("The difference between opening and closing times must be at least 8 hours.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTimes()) return;
        try {
          setIsLoading(true);
          const response = await fetchUpdateProfileWorkTime(openingTime, closingTime);
          if(response.data.success){
            ToastActive('success',"shop workTime details updated successfully");
          }else{
            ToastActive('error','failed to update shop details workTime.')
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
        }finally{
          setIsLoading(false);
        }
  };


  return (
    <div className="time-selector">
      <h2 className="text-lg font-semibold my-4">Select Work Hours</h2>
      <div className="flex flex-col md:flex-row justify-around gap-4">
        <label className="flex flex-col w-full md:w-1/4">
          <span className="text-gray-500 mb-2">Opening Time:</span>
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col w-full md:w-1/4">
          <span className="text-gray-500 mb-2">Closing Time:</span>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="flex flex-col my-4 space-y-3">
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleSubmit}
          className={`btn-primary ${isLoading && "flex justify-center"}`}
        >
          {isLoading ? (
            <ThreeDots height="" color="white" wrapperClass=" w-10 h-6" />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}

export default WorkingTime