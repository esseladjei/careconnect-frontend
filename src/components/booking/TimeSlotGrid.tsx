import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Props {
  timeSlots: TimeSlot[];
  selectedSlot: string | null;
  onSelect: (time: string) => void;
}

const TimeSlotGrid: React.FC<Props> = ({
  timeSlots,
  selectedSlot,
  onSelect,
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-blue-600" />
        Available Time Slots
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={`py-3 px-2 text-sm font-semibold rounded-lg border-2 transition-all ${
              selectedSlot === slot.time
                ? 'bg-green-600 text-white border-green-600 shadow-lg'
                : slot.available
                  ? 'bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
