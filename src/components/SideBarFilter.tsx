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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 via-blue-700 to-blue-800 px-6 py-5">
        <h3 className="text-lg font-bold text-white mb-1">
          Refine Your Search
        </h3>
        <p className="text-blue-50 text-sm">
          {resultsCount} provider{resultsCount !== 1 ? 's' : ''}
          {location && ` in ${location}`}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* --- Checkbox Filter: Health Specialisation --- */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Specialization
          </h4>
          <div className="space-y-2.5">
            {specialtiesLoading && (
              <p className="text-sm text-gray-500 py-2">
                Loading specialties...
              </p>
            )}
            {specialtiesError && !specialtiesLoading && (
              <p className="text-sm text-red-600">
                Unable to load specialties.
              </p>
            )}
            {!specialtiesLoading &&
              !specialtiesError &&
              specialties.length === 0 && (
                <p className="text-sm text-gray-500">
                  No specialties available.
                </p>
              )}
            {specialties.map((spec: string) => (
              <label
                key={spec}
                className="flex items-center cursor-pointer group"
              >
                <input
                  id={`check-${spec}`}
                  type="checkbox"
                  checked={filters.specialties.includes(spec)}
                  onChange={() => toggleSpec(spec)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {spec}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* --- Radio Button Filter: Appointment Type --- */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Appointment Type
          </h4>
          <div className="space-y-2.5">
            {['In-Person', 'Home Visit', 'Phone Consultation'].map((type) => (
              <label
                key={type}
                className="flex items-center cursor-pointer group"
              >
                <input
                  id={`radio-${type}`}
                  name="appointment-type"
                  type="radio"
                  checked={filters.appointmentType === type}
                  onChange={() =>
                    onChange({ ...filters, appointmentType: type as any })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* --- Price Range Filter (Consultation Fee) --- */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Consultation Fee (₵)
          </h4>

          <div className="space-y-3">
            {/* Min Price */}
            <div>
              <label
                htmlFor="min-price"
                className="block text-xs font-semibold text-gray-600 mb-2"
              >
                Minimum
              </label>
              <input
                type="number"
                id="min-price"
                placeholder="₵50"
                value={filters.minPrice}
                onChange={(e) =>
                  onChange({ ...filters, minPrice: e.target.value as any })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all hover:border-gray-400"
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                htmlFor="max-price"
                className="block text-xs font-semibold text-gray-600 mb-2"
              >
                Maximum
              </label>
              <input
                type="number"
                id="max-price"
                placeholder="₵500"
                value={filters.maxPrice}
                onChange={(e) =>
                  onChange({ ...filters, maxPrice: e.target.value as any })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all hover:border-gray-400"
              />
            </div>

            {/* Price Range Display */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
              <p className="text-xs text-gray-600">Price Range</p>
              <p className="text-sm font-bold text-blue-600">
                ₵{filters.minPrice} — ₵{filters.maxPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarFilter;
