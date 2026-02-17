import React from 'react';
import type { FilterParams } from '../types/search.ts';
import { useSpecialties } from '../hooks/useSpecialties';

interface SideBarFilterProps {
  filters: FilterParams;
  resultsCount: number;
  location: string;
  onChange: (filters: FilterParams) => void;
}

const SideBarFilter: React.FC<SideBarFilterProps> = ({
  filters,
  resultsCount,
  location,
  onChange,
}) => {
  const toggleSpec = (spec: string) => {
    onChange({
      ...filters,
      specialties: filters.specialties.includes(spec)
        ? filters.specialties.filter((s) => s !== spec)
        : [...filters.specialties, spec],
    });
  };

  const {
    data: specialties = [],
    isLoading: specialtiesLoading,
    isError: specialtiesError,
  } = useSpecialties();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full sticky top-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Showing {resultsCount} Results in {location || 'all locations'}
      </h3>
      {/* --- Checkbox Filter: Health Specialisation --- */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Specialisation
        </h4>
        <div className="space-y-2">
          {specialtiesLoading && (
            <p className="text-sm text-gray-500">Loading specialties...</p>
          )}
          {specialtiesError && !specialtiesLoading && (
            <p className="text-sm text-red-500">Unable to load specialties.</p>
          )}
          {!specialtiesLoading &&
            !specialtiesError &&
            specialties.length === 0 && (
              <p className="text-sm text-gray-500">No specialties available.</p>
            )}
          {specialties.map((spec: string) => (
            <div key={spec} className="flex items-center">
              <input
                id={`check-${spec}`}
                type="checkbox"
                checked={filters.specialties.includes(spec)}
                onChange={() => toggleSpec(spec)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`check-${spec}`}
                className="ml-3 text-sm text-gray-700"
              >
                {spec}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Radio Button Filter: Appointment Type --- */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Type of Appointment
        </h4>
        <div className="space-y-2">
          {/* ['In-Person', 'Phone Consultation', 'Home Visit']
          change this to read from the database
         */}
          {['In-Person', 'Home Visit', 'Phone Consultation'].map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={`radio-${type}`}
                name="appointment-type"
                type="radio"
                checked={filters.appointmentType === type}
                onChange={() =>
                  onChange({ ...filters, appointmentType: type as any })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`radio-${type}`}
                className="ml-3 text-sm text-gray-700"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Price Range Filter (Consultation Fee) --- */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Consultation Fee (GH¢)
        </h4>

        {/* Price Range Inputs */}
        <div className="flex justify-between items-center space-x-4">
          <div>
            <label
              htmlFor="min-price"
              className="block text-xs text-gray-500 mb-1"
            >
              Min(GH¢)
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="¢50"
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value as any })
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-500 mt-4">—</span>
          <div>
            <label
              htmlFor="max-price"
              className="block text-xs text-gray-500 mb-1"
            >
              Max(GH¢)
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="¢200"
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value as any })
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarFilter;
