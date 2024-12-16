import React, { useState } from 'react'
import { faArrowRight, faCar, faClock, faFile, faIndianRupee, faStar, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Payment, { stripePromise } from '../../reuseComponents/Payment'
import { Elements } from '@stripe/react-stripe-js'
import { BookingProps } from '../../utilities/interface'
import { formatDate } from '../../utilities/functions'




const Summary:React.FC<BookingProps> = ({setActiveSection}) => {
  const shopdetails = useSelector((state:RootState)=>{
    return state.estimate.estimateDetails 
    ? state.estimate.estimateDetails.shopdetails
    : state.bookingdetails.bookingDetails?.shopdetails;
  } );
  const { shedule, vehicleDetails ,userDetails } = useSelector((state: RootState) => state.bookingdetails.bookingDetails) || {};
  const { repairWork,locationdetails } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleEdit = (path:string) => {
    setActiveSection(path)
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  return (
    <div className="flex flex-col justify-center items-center pt-2  ">
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

        <div className="w-full mt-2 ms-1  p-4  pb-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            drop off at
          </p>
          <div className="flex justify-between">
            <p className="text-gray-600  ">
              <FontAwesomeIcon icon={faClock} /> {formatDate(shedule?.date)} at{" "}
              {shedule?.time}{" "}
            </p>
            <p
              onClick={() => handleEdit("DropOff")}
              className="text-mainclr-500 cursor-pointer hover:text-mainclr-600"
            >
              Edit
            </p>
          </div>
          <p className="my-3  font-bold">
            <FontAwesomeIcon icon={faFile} /> Instructions from the shop
          </p>
          <p className="">
            Thank you for contacting {shopdetails?.shopName}. Someone will
            contact you to confirm appointment details.
          </p>
        </div>
      </div>

      <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">
        <div className="w-full mt-2 ms-1  p-4  pb-3">
          <div className="flex justify-between">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              repair summary
            </p>
            <p
              onClick={() => handleEdit("Vehicle")}
              className="text-mainclr-500 cursor-pointer hover:text-mainclr-600"
            >
              Edit
            </p>
          </div>
          <p className="text-gray-600 mt-2">
            <FontAwesomeIcon icon={faCar} />{" "}
            {`${vehicleDetails?.make}, ${vehicleDetails?.model} ${vehicleDetails?.year}`}{" "}
          </p>
          <p className="my-3 text-sm"> {vehicleDetails?.description}</p>
          {repairWork ? (
            <>
              <p className="text-gray-500 text-sm font-semibold uppercase">
                Work Details
              </p>
              <div className="flex justify-between">
                <p className="text-gray-600 mt-2">
                  <FontAwesomeIcon icon={faWrench} /> {`${repairWork?.work}`}{" "}
                </p>
                <p className="text-gray-800 text-lg font-bold">
                  <FontAwesomeIcon icon={faIndianRupee} />{" "}
                  {repairWork?.priceStart} -{" "}
                  <FontAwesomeIcon icon={faIndianRupee} />{" "}
                  {repairWork?.priceEnd}{" "}
                </p>
              </div>
            </>
          ) : (
            <p className="my-3 ">
              <FontAwesomeIcon icon={faFile} /> Let the shop know what’s wrong
            </p>
          )}
        </div>
      </div>

      <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">
        <div className="w-full mt-2 ms-1  p-4  pb-3">
          <div className="flex justify-between">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              CONTACT INFORMATION
            </p>
            <p
              onClick={() => handleEdit("ContactInfo")}
              className="text-mainclr-500 cursor-pointer hover:text-mainclr-600"
            >
              Edit
            </p>
          </div>

          <p className="my-3">
            {`${userDetails?.firstName}, ${userDetails?.lastName} `}{" "}
          </p>
          <p className="my-3 ">{userDetails?.email}</p>
          <p className="my-3 ">{userDetails?.phoneNumber}</p>
          {locationdetails?.description && locationdetails?.description.length !== 0 && (
            <p className="my-3 text-wrap overflow-auto">
                <span className="block text-gray-500 text-sm">address:</span>
                {locationdetails?.description}
                {locationdetails?.description.length}
                </p>
          )}
        </div>
      </div>

      <div className="mt-3 px-1 flex justify-center ">
      <Elements stripe={stripePromise}>
        <button onClick={()=> setIsModalOpen(true)} className="btn-primary">
          Request Appointment <FontAwesomeIcon icon={faArrowRight} />
        </button>
      <Payment 
          isOpen={isModalOpen} 
          closeModal={closeModal}
          methodofBooking='booking'
          bookingDetails={{
            shopdetails,
            shedule,
            vehicleDetails,
            userDetails,
            repairWork,
            locationdetails
          }} />
      </Elements>
      </div>

    </div>
  );
}


export default Summary