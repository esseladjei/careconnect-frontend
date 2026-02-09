import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface Props {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  workingDays?: number[];
}

const DateSelector: React.FC<Props> = ({
  selectedDate,
  onSelect,
  minDate,
  maxDate,
  workingDays,
}) => {
  const days = [];
  const today = new Date();
  const startDate = minDate && minDate > today ? minDate : today;

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Skip if date is beyond maxDate
    if (maxDate && date > maxDate) break;

    days.push(date);
  }

  const isWorkingDay = (date: Date): boolean => {
    if (!workingDays || workingDays.length === 0) return true;
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon...
    const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    return workingDays.includes(normalizedDay);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        Select a Date
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isSelected = selectedDate.toDateString() === day.toDateString();
          const isWorking = isWorkingDay(day);
          const isDisabled = !isWorking;

          return (
            <button
              key={index}
              onClick={() => onSelect(day)}
              disabled={isDisabled}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                  : isDisabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="text-xs font-medium">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={`text-lg font-bold ${
                  isSelected
                    ? 'text-white'
                    : isDisabled
                      ? 'text-gray-400'
                      : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="text-xs">
                {day.toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>
      {workingDays && workingDays.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Grayed out dates are non-working days
        </p>
      )}
    </div>
  );
};

export default DateSelector;
