import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowRight, faBolt, faCar, faClock, faEnvelope, faFile, faLocationDot, faPhone, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { Elements } from '@stripe/react-stripe-js';
import Payment, { stripePromise } from '../../reuseComponents/Payment';
import { BookingProps } from '../../utilities/interface';
import { formatDate, formatTime, getNextAvailableDate } from '../../utilities/functions';
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';

const Summary:React.FC<BookingProps> = ({setActiveSection}) => {
    const { shedule, vehicleDetails ,userDetails, shopdetails,locationdetails } = useSelector((state: RootState) => state.pickMyCar.PickCarDetails) || {};
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
      setIsModalOpen(false);
    };


    const handleEdit = (path:string) => {
        setActiveSection(path)
      }


  return (
    <div className="flex flex-col items-center pt-2  ">
      <HoverMotionWrapper className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 lg:w-1/2 mb-4 ">
        <p className="text-gray-500 text-sm font-semibold uppercase">
          Booking Details
        </p>
        <div className="flex flex-col md:flex-row items-start pb-4 pt-2 mt-3 gap-4">
          <div className="w-full md:w-32  rounded overflow-hidden">
            <img
              src={shopdetails?.image}
              alt="shop img"
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex flex-col  w-full">
            <div className="flex  justify-between">
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
        <div className="w-full mt-2 ms-1  p-4  pb-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            pickup sheduled on :
          </p>
          <div className="flex justify-between items-center">
            <p className="text-gray-600  ">
              <FontAwesomeIcon icon={faClock} /> {formatDate(shedule?.date)} at{" "}
              {shedule?.time}{" "}
            </p>
            <p
              onClick={() => handleEdit("Time")}
              className="text-mainclr-500 cursor-pointer hover:text-mainclr-600"
            >
              Edit
            </p>
          </div>
          <p className="my-3  font-bold">
            <FontAwesomeIcon icon={faFile} /> Instructions from the shop
          </p>
          <p className="">
            Thank you for contacting {shopdetails?.shopName}. shortly we will
            contact you to confirm appointment details.
          </p>
        </div>
      </HoverMotionWrapper>

      <HoverMotionWrapper className="border rounded-lg h-fit p-5 w-full max-w-xl md:w-2/3 lg:w-1/2 mb-4">
        <div className="w-full mt-2 p-4  pb-3">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              vehicle details
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
        </div>
      </HoverMotionWrapper>

      <HoverMotionWrapper className="border rounded-lg h-fit p-5 w-full max-w-xl md:w-2/3 lg:w-1/2 mb-4  ">
        <div className="w-full mt-2  p-4  pb-3">
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
          <p className="my-3 "> <FontAwesomeIcon icon={faEnvelope} /> {userDetails?.email}</p>
          <p className="my-3 flex-wrap "><FontAwesomeIcon icon={faPhone} /> {userDetails?.phoneNumber}</p>
          <p className="my-3 text-wrap overflow-auto">
            <span className="block text-gray-500 text-sm">
              <FontAwesomeIcon icon={faLocationDot} /> pick up location:
            </span>
            {locationdetails?.description}
          </p>
        </div>
      </HoverMotionWrapper>

      <div className="mt-3 px-1 flex justify-center w-full">
        <Elements stripe={stripePromise}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary  w-full max-w-xs"
          >
            Request Pickup <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <Payment
            isOpen={isModalOpen}
            closeModal={closeModal}
            methodofBooking="pickup"
            bookingDetails={{
              shopdetails,
              shedule,
              vehicleDetails,
              userDetails,
              locationdetails,
            }}
          />
        </Elements>
      </div>
    </div>
  );
}

export default Summary