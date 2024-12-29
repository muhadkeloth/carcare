import React, { useState } from 'react'
import { faArrowRight,faUser, faBolt, faCar, faClock, faEnvelope, faFile, faIndianRupee, faLocationDot, faPhone, faStar, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Payment, { stripePromise } from '../../reuseComponents/Payment'
import { Elements } from '@stripe/react-stripe-js'
import { BookingProps } from '../../utilities/interface'
import { formatDate, formatTime, getNextAvailableDate } from '../../utilities/functions'
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper '




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
    <div className="flex flex-col items-center pt-2  ">
      <HoverMotionWrapper className="border rounded-lg h-fit p-5 w-full  max-w-xl md:w-2/3 lg:w-1/2 mb-4 ">
        <p className="text-gray-500 text-sm font-semibold uppercase">
          drop off at
        </p>
        <div className="flex flex-col md:flex-row items-start pb-4 pt-2 mt-3 gap-4">
          <div className="w-full md:w-32  rounded overflow-hidden">
            <img
              src={shopdetails?.image}
              alt="shop img"
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <h2 className=" text-base font-medium text-gray-900 truncate">
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
                    {(
                      shopdetails.rating.ratingSum / shopdetails.rating.count
                    ).toFixed(1)}{" "}
                    ({shopdetails.rating.count})
                  </>
                )}
              </p>
            </div>
            <span className="mt-3 text-sm text-gray-600 break-words">
              <FontAwesomeIcon icon={faLocationDot} />{" "}
              {shopdetails?.address &&
                Object.values(shopdetails?.address).join(" ")}
            </span>
            <span className="mt-3 text-sm  text-gray-600">
              <FontAwesomeIcon icon={faPhone} /> {shopdetails?.phoneNumber}
            </span>

            <h6 className="mt-3 text-sm  text-gray-600">
              <FontAwesomeIcon icon={faBolt} /> Soonest availability:{" "}
              {getNextAvailableDate()}
              {" - "}
              {formatTime(shopdetails?.workingTime?.opening || "")}
            </h6>
          </div>
        </div>

        <div className="w-full mt-2  p-4  pb-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            drop off at
          </p>
          <div className="flex justify-between items-center">
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
          <p>
            Thank you for contacting {shopdetails?.shopName}. Someone will
            contact you to confirm appointment details.
          </p>
        </div>
      </HoverMotionWrapper>

      <HoverMotionWrapper className="border rounded-lg h-fit p-5 w-full max-w-xl md:w-2/3 lg:w-1/2 mb-4 ">
        <div className="w-full mt-2 p-4  pb-3">
          <div className="flex justify-between items-center">
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
              <div className="flex justify-between items-center">
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
      </HoverMotionWrapper>

      <HoverMotionWrapper className="border rounded-lg h-fit p-5 w-full max-w-xl md:w-2/3 lg:w-1/2 mb-4 ">
        <div className="w-full mt-2 p-4 pb-3">
          <div className="flex justify-between items-center">
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
          <FontAwesomeIcon icon={faUser} /> {`${userDetails?.firstName} ${userDetails?.lastName} `}{" "}
          </p>
          <p className="my-3 ">
            <FontAwesomeIcon icon={faEnvelope} /> {userDetails?.email}
          </p>
          <p className="my-3 ">
            <FontAwesomeIcon icon={faPhone} /> {userDetails?.phoneNumber}
          </p>
          {locationdetails?.description && (
            <p className="my-3 text-wrap ">
              <FontAwesomeIcon icon={faLocationDot} />{" "}
              <span className="block text-gray-500 text-sm">address:</span>
              {locationdetails?.description}
              {locationdetails?.description.length}
            </p>
          )}
        </div>
      </HoverMotionWrapper>

      <div className="mt-3 px-1 flex justify-center w-full">
        <Elements stripe={stripePromise}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full max-w-xs"
          >
            Request Appointment <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <Payment
            isOpen={isModalOpen}
            closeModal={closeModal}
            methodofBooking="booking"
            bookingDetails={{
              shopdetails,
              shedule,
              vehicleDetails,
              userDetails,
              repairWork,
              locationdetails,
            }}
          />
        </Elements>
      </div>
    </div>
  );
}


export default Summary