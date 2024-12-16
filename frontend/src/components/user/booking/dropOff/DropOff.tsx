import React, { useState } from 'react'
import { format, isBefore, isSunday,  addMonths } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import TimeSlot from './TimeSlot';
import { useDispatch, useSelector } from 'react-redux';
import { setDateAndTime } from '../../../../features/bookingSlice';
import { RootState } from '../../../../store';
import {  BookingProps } from '../../../utilities/interface';
import { generateDaysInMonth } from '../../../utilities/functions';



const DropOff:React.FC<BookingProps> = ({ setActiveSection}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const dispatch = useDispatch()
    const shopdetails = useSelector((state:RootState)=>{
      return state.estimate.estimateDetails 
      ? state.estimate.estimateDetails.shopdetails
      : state.bookingdetails.bookingDetails?.shopdetails;
    } );

    const daysInMonth = generateDaysInMonth(currentMonth, selectedDate);

    const handleDateClick = (date: Date) => {
      if (!isBefore(date, new Date()) && !isSunday(date)) {
        setSelectedDate(date);
      }
    };

  const handleDropoffDateAndTime = () => {
      if(selectedDate && selectedTime){
        dispatch(setDateAndTime({selectedDate ,selectedTime}))
      }
      setActiveSection('Vehicle')     
  }


  const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));


    
  return (
    <div className="flex justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          When can you drop off your car?
        </h1>

        <div className="p-4 mt-4 mx-auto  shadow-sm ">
          <div className="flex justify-between items-center mb-4">
            <button className="btn-primary" onClick={handlePrevMonth}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <h2 className="text-lg font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button className="btn-primary" onClick={handleNextMonth}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-600 uppercase"
              >
                {day}
              </div>
            ))}

            {daysInMonth.map(({ date, isDisabled, isToday, isSelected }) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={`p-2 rounded-lg text-center ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-mainclr-100 hover:text-mainclr-600"
                } ${isToday ? "bg-green-100 text-green-600" : ""} ${
                  isSelected ? "bg-mainclr-600 text-white" : ""
                }`}
              >
                {format(date, "d")}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col justify-center items-center mx-auto ">
          <h2 className="text-lg font-bold mb-4 uppercase">
            times for {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex flex-wrap">
            <TimeSlot
              setSelectedTime={setSelectedTime}
              selectedTime={selectedTime}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg h-fit p-3  ">
        <p className="text-gray-500 text-sm font-semibold uppercase">
          drop off at
        </p>

        <div className="flex pb-4 pt-2   border-b">
          <div className="w-28  rounded overflow-hidden">
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
                    {(
                      shopdetails.rating.ratingSum / shopdetails.rating.count
                    ).toFixed(1)}{" "}
                    ({shopdetails.rating.count})
                  </>
                )}
                {/* {" "}
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />{" "}
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
              Soonest availability Wed, Oct 15 at 8 am
            </h6>
          </div>
        </div>

        <div className="mt-3 px-1 flex justify-center ">
          <button
            onClick={() => handleDropoffDateAndTime()}
            disabled={!selectedDate || !selectedTime}
            className={`btn-primary ${
              !selectedDate || !selectedTime
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            confirm date and time <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DropOff