import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface Props {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const DateSelector: React.FC<Props> = ({ selectedDate, onSelect }) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        Select a Date
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isSelected = selectedDate.toDateString() === day.toDateString();
          return (
            <button
              key={index}
              onClick={() => onSelect(day)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="text-xs font-medium">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}
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
    </div>
  );
};

export default DateSelector;
