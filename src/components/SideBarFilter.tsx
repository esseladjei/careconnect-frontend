import React from 'react';

interface SidebarFilterProps {
  mockResults: any[];
}

const SideBarFilter: React.FC<SidebarFilterProps> = ({ mockResults }) => {
  // Mock data for filters
  const specialisations = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics'];
  const appointmentTypes = ['In-person', 'Video Call'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Refine Results</h3>
           <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Showing {mockResults.length} Results in London
            </h3>
      {/* --- Checkbox Filter: Health Specialisation --- */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Specialisation</h4>
        <div className="space-y-2">
          {specialisations.map((spec) => (
            <div key={spec} className="flex items-center">
              <input
                id={`check-${spec}`}
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`check-${spec}`} className="ml-3 text-sm text-gray-700">
                {spec}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Radio Button Filter: Appointment Type --- */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Type of Appointment</h4>
        <div className="space-y-2">
          {appointmentTypes.map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={`radio-${type}`}
                name="appointment-type"
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`radio-${type}`} className="ml-3 text-sm text-gray-700">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Price Range Filter (Consultation Fee) --- */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Consultation Fee (USD)</h4>
        
        {/* Price Range Inputs */}
        <div className="flex justify-between items-center space-x-4">
          <div>
            <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
              Min
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="$50"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-500 mt-4">—</span>
          <div>
            <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
              Max
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="$200"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            />
          </div>
        </div>

      </div>
      
      {/* Apply Filters Button */}
      <button
        type="button"
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Apply Filters
      </button>

    </div>
  );
};

export default SideBarFilter;