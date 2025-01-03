import React, { useEffect, useState } from 'react'
import { format, isBefore, isSunday,  addMonths } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowRight, } from '@fortawesome/free-solid-svg-icons';
import TimeSlot from '../../reuseComponents/TimeSlot';
import { useDispatch, useSelector } from 'react-redux';
import { setDateAndTime } from '../../../features/bookingSlice';
import { RootState } from '../../../store';
import {  BookingProps } from '../../utilities/interface';
import { addTimeinDate, generateDaysInMonth, } from '../../utilities/functions';
import  { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import DropOffTemp from '../../reuseComponents/DropOffTemp';
import CalendarPicker from '../../reuseComponents/CalendarPicker';
import { navigateFindWorkShop } from '../../utilities/navigate/userNavigator';
import { useNavigate } from 'react-router-dom';



const DropOff:React.FC<BookingProps> = ({ setActiveSection}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const shopdetails = useSelector((state:RootState)=>{
      return state.estimate.estimateDetails 
      ? state.estimate.estimateDetails.shopdetails
      : state.bookingdetails.bookingDetails?.shopdetails;
    } );

      useEffect(()=> {
        if(!shopdetails)navigateFindWorkShop(navigate)
      },[shopdetails])


    const daysInMonth = generateDaysInMonth(currentMonth, selectedDate);

    const handleDateClick = (date: Date) => {
      if (!isBefore(date, new Date()) && !isSunday(date)) {
        setSelectedDate(date);
      }
    };

  const handleDropoffDateAndTime = () => {
      if(selectedDate && selectedTime){
        const updatedDate:Date = addTimeinDate(selectedDate,selectedTime);
        dispatch(setDateAndTime({selectedDate:updatedDate.toISOString() ,selectedTime}))
      }
      setActiveSection('Vehicle')     
  }


  const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));


  return (
      <div className="flex flex-col sm:flex-row justify-center pt-2 gap-4">
        <div className="border rounded-lg flex flex-col sm:w-1/2 lg:w-1/3">
          <h1 className="text-2xl border-b py-6 px-14 font-semibold">
            When can you drop off your car?
          </h1>
  
          <CalendarPicker 
            currentMonth={currentMonth}
            daysInMonth={daysInMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDateClick={handleDateClick} />
          {selectedDate && (
            <DropMotionWrapper className="p-4 flex flex-col justify-center items-center mx-auto ">
              <h2 className="text-lg font-bold mb-4 uppercase">
                times for {format(currentMonth, "MMMM yyyy")}
              </h2>
              <div className="flex flex-wrap">
                <TimeSlot
                  setSelectedTime={setSelectedTime}
                  selectedTime={selectedTime}
                  wokingTime={shopdetails?.workingTime}
                />
              </div>
            </DropMotionWrapper>
          )}
        </div>
  
        <div className="border rounded-lg h-fit p-3 sm:w-1/2 md:w-2/5 lg:w-1/3 mt-4 sm:mt-0  ">
            <DropOffTemp shopdetails={shopdetails} />
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