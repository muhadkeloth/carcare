import React from "react";
import { TimeSlotProps } from "../../../utilities/interface";
import { generateTimeSlots } from "../../../utilities/functions";




const TimeSlot: React.FC<TimeSlotProps> = ({selectedTime,setSelectedTime}) => {
  const timeSlots = generateTimeSlots("9:00", "17:00");

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => handleTimeSelect(time)}
          className={`p-2 text-center rounded-full ${
            selectedTime === time
              ? "btn-primary"
              : "bg-gray-100 text-gray-700 hover:bg-mainclr-100 hover:text-mainclr-600"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlot;
