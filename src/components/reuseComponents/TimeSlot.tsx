import { useEffect, useState } from "react";
import { TimeSlotProps } from "../utilities/interface";
import { generateTimeSlots } from "../utilities/functions";
import { HoverMotionWrapper } from "./ui/MotionWrapper ";


const TimeSlot = ({selectedTime,setSelectedTime,wokingTime,selectedDate}:TimeSlotProps) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(()=> {
    console.log('selectedDate',selectedDate)
    if(wokingTime){
      setTimeSlots(generateTimeSlots(wokingTime.opening, wokingTime.closing))
    }else{
      setTimeSlots(generateTimeSlots("9:00", "17:00"));
    }

  },[wokingTime])

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time) => (
        <HoverMotionWrapper className="flex justify-center" key={time}>
          <button
            onClick={() => handleTimeSelect(time)}
            className={`p-2 text-center rounded-full ${
              selectedTime === time
                ? "btn-primary"
                : "bg-gray-100 text-gray-700 hover:bg-mainclr-100 hover:text-mainclr-600"
            }`}
          >
            {time}
          </button>
        </HoverMotionWrapper>
      ))}
    </div>
  );
};

export default TimeSlot;
