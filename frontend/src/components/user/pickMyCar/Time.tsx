import React, { useState } from 'react'
import { estimateProps } from '../estimate/Locationfind'
import { useDispatch } from 'react-redux';
import { addDays, addMonths, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSunday, startOfMonth, startOfWeek } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TimeSlot from '../booking/dropOff/TimeSlot';
import { setDateAndTimePickCar } from '../../../features/pickMyCarSlice';

type Day = {
    date:Date;
    isDisabled:boolean;
    isToday:boolean;
    isSelected:boolean;
};


const Time:React.FC<estimateProps> = ({setActiveSection}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const dispatch = useDispatch()

    
    const generateDaysInMonth = (month:Date): Day[] => {
        const start = startOfWeek(startOfMonth(month));
        const end = endOfWeek(endOfMonth(month));
        const days:Day[] = [];
        let date = start;

        while(!isAfter(date,end)){
            const isDisabled = isBefore(date, new Date()) || isSunday(date);
            const isToday = isSameDay(date,new Date());
            const isSelected = selectedDate ? isSameDay(date,selectedDate) : false;
            days.push({date,isDisabled,isToday, isSelected});
            date = addDays(date,1);
        }
        return days;
    }

    const daysInMonth = generateDaysInMonth(currentMonth);

  const handleDateClick = (date: Date) => {
    if (!isBefore(date, new Date()) && !isSunday(date)) {
      setSelectedDate(date);
    }
  };

  const handleDropoffDateAndTime = () => {
      if(selectedDate && selectedTime){
        dispatch(setDateAndTimePickCar({selectedDate ,selectedTime}))
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
            <TimeSlot setSelectedTime={setSelectedTime} selectedTime={selectedTime} />
          </div>
        </div>
        <div className="  flex flex-col p-4 items-center">
                     <button onClick={()=>handleDropoffDateAndTime()}
                     disabled={!selectedDate || !selectedTime}
                     className= {`btn-primary ${!selectedDate || !selectedTime ? "opacity-50 cursor-not-allowed" : "" } `}>
                       confirm date and time <FontAwesomeIcon icon={faArrowRight} />
                     </button>
        </div>
      </div>
    </div>
  )
}

export default Time