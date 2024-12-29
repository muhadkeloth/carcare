import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {  addMonths, format, isBefore, isSunday, } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TimeSlot from '../../reuseComponents/TimeSlot';
import { setDateAndTimePickCar } from '../../../features/pickMyCarSlice';
import {  BookingProps } from '../../utilities/interface';
import { addTimeinDate, generateDaysInMonth } from '../../utilities/functions';
import { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import CalendarPicker from '../../reuseComponents/CalendarPicker';


const Time:React.FC<BookingProps> = ({setActiveSection}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const dispatch = useDispatch()

    
  const daysInMonth = generateDaysInMonth(currentMonth,date);

  const handleDateClick = (date: Date) => {
    if (!isBefore(date, new Date()) && !isSunday(date)) {
      setDate(date);
    }
  };

  const handleDropoffDateAndTime = () => {
      if(date && time){
        const updatedDate:Date = addTimeinDate(date,time);
        dispatch(setDateAndTimePickCar({date:updatedDate.toISOString() ,time}))
      }
      setActiveSection('Summary')     
  }


  const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));


  return (
    <div className="flex justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          When should we schedule your car pickup?
        </h1>

        <CalendarPicker 
          currentMonth={currentMonth}
          daysInMonth={daysInMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateClick={handleDateClick} />

        {/* <div className="p-4 mt-4 mx-auto  shadow-sm ">
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
        </div> */}
        {/* here */}

        {date && (
        <DropMotionWrapper className="p-4 flex flex-col justify-center items-center mx-auto ">
          <h2 className="text-lg font-bold mb-4 uppercase">
            times for {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex flex-wrap">
            <TimeSlot
              setSelectedTime={setTime}
              selectedTime={time}
            />
          </div>
        
        <div className="  flex flex-col p-4 items-center">
          <button
            onClick={() => handleDropoffDateAndTime()}
            disabled={!date || !time}
            className={`btn-primary ${
              !date || !time
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            confirm date and time <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
          </DropMotionWrapper>
          )}
      </div>
    </div>
  );
}

export default Time