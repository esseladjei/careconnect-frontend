import React from 'react';

interface SearchResult {
/*  id: number;
  name: string;
  specialisation: string;
  service?: string;
  location: string;
  rating: number;
  price: string;
  imageUrl: string;
  availableSlots: number;*/
  provider: {
    _id: string;
    userId: {
      _id: string;
      email: string;
      role: string;
      firstname: string;
      lastname: string;
    };
    gender: string;
    specialization: string;
    bio: string;
    experience: number;
    hourlyRate: number;
    available: boolean;
    location: string;
    languages: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  slots: Array<{
    start: string;
    end: string;
    price: number;
  }>;
}

interface SearchResultItemProps {
  result: SearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  return (
    <div
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 
    border border-gray-100 flex flex-col text-center aspect-video basis-30"
    >

      {/* Top: Avatar */}
      <div className='flex justify-between'>
        <div className="w-15 h-15 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mb-3">
          <span className="text-3xl text-blue-500">👨‍⚕️</span>
        </div>
        <div className="text-right">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
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
          <span className="mr-1">📍</span>{result.provider.location}
        </p>
        <p className="text-sm text-gray-500 font-medium mb-1">
          <span className="mr-1 text-yellow-500">⭐</span>
          {result.provider.hourlyRate.toFixed(1)}
        </p>
      </div>


      {/* Bottom: Availability + Button */}
      <div className="w-full">
        <p className="text-xs text-left text-gray-500 mb-3">
            {result.provider.bio}
        </p>
        {result.slots.map((slot, index) => (
          <p key={index} className="text-xs text-blue-600 font-semibold mb-2">
            {slot.start} - {slot.end}  Slots Today
          </p>
        ))}


        <a className="block w-full px-10 py-2 mb-3 text-base font-medium text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 md:mr-5 md:mb-0"
          href={`/offerdetails/${result.provider._id}`}>
          Book Appointment
        </a>
      </div>

    </div>
  );
};

export default SearchResultItem;