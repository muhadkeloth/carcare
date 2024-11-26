import React from 'react'


const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    let [hour, minute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
  
    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      // const formattedTime = `${hour}:${minute === 0 ? "00" : minute}`;
      const period = hour >= 12 ? "PM" : "AM";
      const adjustedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  
      slots.push(`${adjustedHour}:${minute === 0 ? "00" : minute} ${period}`);
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
    }
    return slots;
  };

  interface TimeSlotProps {
    selectedTime: string | null;
    setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
  }


const TimeSlot:React.FC<TimeSlotProps> = ({ selectedTime, setSelectedTime }) => {

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
  )
}

export default TimeSlot