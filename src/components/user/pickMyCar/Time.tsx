import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  addMonths, format, isBefore, isSunday, } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TimeSlot from '../../reuseComponents/TimeSlot';
import { setDateAndTimePickCar } from '../../../features/pickMyCarSlice';
import {  BookingProps } from '../../utilities/interface';
import { addTimeinDate, generateDaysInMonth } from '../../utilities/functions';
import { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import CalendarPicker from '../../reuseComponents/CalendarPicker';
import { RootState } from '../../../store';
import { fetchReservedTimes } from '../../../services/userService';


const Time:React.FC<BookingProps> = ({setActiveSection}) => {
  const { shopdetails } = useSelector((state: RootState) => state.pickMyCar.PickCarDetails) || {};
    const [reservedTimes, setReservedTimes] = useState<string[]>([]);
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

    useEffect(()=>{
      const fetchAvailableTimes = async() => {
            try {
              if (!date) return; 
              const datez = new Date(date);
              const dateInUTC = new Date(Date.UTC(datez.getFullYear(), datez.getMonth(), datez.getDate()));
              const formattedDate = dateInUTC.toISOString().split('T')[0];
              const response = await fetchReservedTimes(formattedDate,'pickup',shopdetails?._id);
              setReservedTimes(response.data.reservedTimes)            
            } catch (error) {
              console.log('fetch reserved times error')
            }
      }
      fetchAvailableTimes()
    },[date])

  useEffect(()=> {
    if(!shopdetails)setActiveSection('Location')
  },[shopdetails])


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

        {date && (
        <DropMotionWrapper className="p-4 flex flex-col justify-center items-center mx-auto ">
          <h2 className="text-lg font-bold mb-4 uppercase">
            times for {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex flex-wrap">
            <TimeSlot
              setSelectedTime={setTime}
              selectedTime={time}
              wokingTime={shopdetails?.workingTime}
              reservedTimes={reservedTimes}
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