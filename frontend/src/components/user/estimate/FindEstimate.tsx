import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCar, faIndianRupeeSign, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { navigateBookingSlot } from '../../utilities/navigate/userNavigator';


const FindEstimate:React.FC = () => {
  const { shopdetails, repairWork } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
  const navigate = useNavigate();
    const handleBookAppointment = () => {
      navigateBookingSlot(navigate);
    }


  return (
    <div className="flex flex-col justify-center items-center pt-2   ">
      <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 my-4 ">
        <div className="w-full mt-2 ms-1  p-4  pb-3">
          <div className="flex justify-between">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              repair summary
            </p>
            <p className="text-gray-800 text-lg font-bold">
              <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
              {repairWork?.priceStart} -{" "}
              <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
              {repairWork?.priceEnd}{" "}
            </p>
          </div>
          <p className="text-gray-600 mt-2">
            <FontAwesomeIcon icon={faCar} /> {`${repairWork?.work}`}{" "}
          </p>
        </div>
      </div>

      <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3  mb-4 ">
        <p className="text-gray-500 text-sm font-semibold uppercase">
          drop off at
        </p>
        <div className="flex pb-4 pt-2 mt-3 ">
          <div className="w-32  rounded overflow-hidden">
            <img
              src={shopdetails?.image}
              alt="shop img"
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex flex-col  ms-3 w-full">
            <div className="flex  justify-between">
              <h2 className=" max-w-full break-words whitespace-normal text-base font-medium  text-gray-900">
                {shopdetails?.shopName &&
                  shopdetails?.shopName[0].toUpperCase() +
                    shopdetails?.shopName.slice(1)}
              </h2>
              <p className="text-gray-500 text-sm">
              {shopdetails?.rating && (
                        <>
                        <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-400"
                        />{" "}
                      {(shopdetails.rating.ratingSum / shopdetails.rating.count).toFixed(1)} ({shopdetails.rating.count})
                        </>
                      )}
                {/* {" "}
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-400"
                />{" "}
                4.8 (15) */}
              </p>
            </div>
            <span className="mt-3 max-w-full break-words whitespace-normal text-sm  text-gray-600">
              {shopdetails?.address &&
                Object.values(shopdetails?.address).join(" ")}
            </span>
            <span className="mt-3 text-sm  text-gray-600">
              {shopdetails?.phoneNumber}
            </span>

            <h6 className="mt-3 text-sm  text-gray-600">
              availability Wed, Oct 15 at 8 am
            </h6>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1 flex justify-center ">
        <button onClick={() => handleBookAppointment()} className="btn-primary">
          Book Appointment <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}

export default FindEstimate