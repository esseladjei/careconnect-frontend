import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../types/search.ts';

interface SearchResultItemProps {
  result: SearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  const navigate = useNavigate();

  const handleSlotClick = (slot: SearchResult['slots'][0]) => {
    navigate(`/offerdetails/${result.provider._id}`, {
      state: { selectedSlot: slot },
    });
  };

  return (
    <div
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 
    border border-gray-100 flex flex-col text-center aspect-video basis-30"
    >
      {/* Top: Avatar */}
      <div className="flex justify-between">
        <div className="w-15 h-15 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mb-3">
          <span className="text-3xl text-blue-500">👨‍⚕️</span>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {result.provider.userId.title} {result.provider.userId.firstname}{' '}
            {result.provider.userId.lastname}
          </h3>

          <h3 className="text-lg text-gray-900 leading-tight mt-2">
            Gh¢ {result.provider.hourlyRate}
          </h3>
        </div>
        {/* Middle: Name + Specialty */}
      </div>

      {/* Middle: Location + Rating */}
      <div className="flex justify-evenly text-gray-500 text-xs space-y-1 mb-4">
        <p className="text-sm text-gray-500 font-medium mb-1 border-r pr-2">
          {result.provider.specialization}
        </p>
        <p className="text-sm text-gray-500 font-medium mb-1 border-r pr-2">
          <span className="mr-1">📍</span>
          {result.provider.location}
        </p>
        <p className="text-sm text-gray-500 font-medium mb-1">
          <span className="mr-1 text-yellow-500">⭐</span>
          GH¢ {result.provider.hourlyRate.toFixed(1)}
        </p>
      </div>

      {/* Bottom: Availability + Button */}
      <div className="w-full">
        <p className="text-xs text-left text-gray-500 mb-3">
          {result.slots.length} Slots Today
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {result.slots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleSlotClick(slot)}
              className="text-xs px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer border border-blue-300"
            >
              {new Date(slot.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(slot.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </button>
          ))}
        </div>

        <a
          className="block w-full px-10 py-2 mb-3 text-base font-medium text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 md:mr-5 md:mb-0"
          href={`/offerdetails/${result.provider._id}`}
        >
          Book Appointment
        </a>
      </div>
    </div>
  );
};

export default SearchResultItem;
