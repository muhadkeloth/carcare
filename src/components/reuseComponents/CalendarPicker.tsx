import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Day } from "../utilities/interface";

interface CalendarPickerProps {
  currentMonth: Date;
  daysInMonth: Day[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
}

const CalendarPicker = ({currentMonth,
  daysInMonth,
  onPrevMonth,
  onNextMonth,
  onDateClick,}:CalendarPickerProps) => {

  return (
    <div className="p-4 mt-4 mx-auto shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <button className="btn-primary" onClick={onPrevMonth}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <button className="btn-primary" onClick={onNextMonth}>
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>

    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-medium text-gray-600 uppercase">
          {day}
        </div>
      ))}

      {daysInMonth.map(({ date, isDisabled, isToday, isSelected }) => (
        <motion.button
          key={date.toISOString()}
          onClick={() => onDateClick(date)}
          disabled={isDisabled}
          className={`p-2 rounded-lg text-center ${
            isDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-mainclr-100 hover:text-mainclr-600"
          } ${isToday ? "bg-green-100 text-green-600" : ""} ${
            isSelected ? "bg-mainclr-600 text-white" : ""
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={isDisabled ? undefined : { scale: 1.07 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {format(date, "d")}
        </motion.button>
      ))}
    </div>
  </div>
  )
}

export default CalendarPicker