import React from 'react';

const SlotLegend: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Slot Availability Guide
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-white border-2 border-green-300 rounded flex items-center justify-center text-xs font-semibold text-green-700">
            09:00
          </div>
          <span className="text-sm text-gray-600">
            Available - Click to book
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-green-600 border-2 border-green-600 rounded flex items-center justify-center text-xs font-semibold text-white shadow-lg">
            10:00
          </div>
          <span className="text-sm text-gray-600">Selected - Your choice</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center text-xs font-semibold text-gray-400">
            11:00
          </div>
          <span className="text-sm text-gray-600">Booked - Not available</span>
        </div>
      </div>
    </div>
  );
};

export default SlotLegend;
