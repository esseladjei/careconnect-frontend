import React, { useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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
  const [expandedSections, setExpandedSections] = useState({
    specialization: true,
    appointmentType: true,
    priceRange: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSpec = (spec: string) => {
    onChange({
      ...filters,
      specialties: filters.specialties.includes(spec)
        ? filters.specialties.filter((s) => s !== spec)
        : [...filters.specialties, spec],
    });
  };

  // Fetch specialties using custom hook
  const {
    data: specialties = [],
    isLoading: specialtiesLoading,
    isError: specialtiesError,
  } = useSpecialties();

  const selectedCount = filters.specialties.length;

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

      <div className="divide-y divide-gray-200">
        {/* --- SPECIALIZATION SECTION --- */}
        <div className="px-6 py-4">
          <button
            onClick={() => toggleSection('specialization')}
            className="w-full flex items-center justify-between py-2 hover:opacity-75 transition-opacity"
            aria-expanded={expandedSections.specialization}
            aria-controls="specialization-content"
          >
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Specialization
              </h4>
              {selectedCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {selectedCount}
                </span>
              )}
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                expandedSections.specialization ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {expandedSections.specialization && (
            <div id="specialization-content" className="mt-4 space-y-2">
              {specialtiesLoading && (
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-r-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">
                      Loading specialties...
                    </p>
                  </div>
                </div>
              )}

              {specialtiesError && !specialtiesLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Unable to load specialties
                  </p>
                </div>
              )}

              {!specialtiesLoading &&
                !specialtiesError &&
                specialties.length === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      No specialties available
                    </p>
                  </div>
                )}

              {!specialtiesLoading &&
                !specialtiesError &&
                specialties.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {specialties.map((spec: string) => {
                      const isChecked = filters.specialties.includes(spec);
                      return (
                        <div key={spec} className="relative">
                          <input
                            id={`check-${spec}`}
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSpec(spec)}
                            className="sr-only peer"
                            aria-label={`Filter by ${spec}`}
                          />
                          <label
                            htmlFor={`check-${spec}`}
                            className={`flex items-center gap-2 px-3 py-2.5 
                              border-2 rounded-lg cursor-pointer 
                              transition-all duration-200 
                              hover:border-blue-300 hover:bg-blue-50/50
                              peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 
                              peer-focus-visible:outline-blue-500
                              ${
                                isChecked
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200'
                              }`}
                          >
                            <div
                              className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all flex items-center justify-center
                              ${
                                isChecked
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isChecked && (
                                <CheckIcon className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium truncate
                              ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}
                            >
                              {spec}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {selectedCount > 0 && (
            <button
              onClick={() => onChange({ ...filters, specialties: [] })}
              className="mt-2 w-full py-2 px-3 text-xs font-medium text-blue-600
                    hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
              aria-label="Clear all specialization filters"
            >
              Clear All ({selectedCount})
            </button>
          )}
        </div>
      </div>

      {/* --- APPOINTMENT TYPE SECTION --- */}
      <div className="px-6 py-4">
        <button
          onClick={() => toggleSection('appointmentType')}
          className="w-full flex items-center justify-between py-2 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.appointmentType}
          aria-controls="appointment-type-content"
        >
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Appointment Type
          </h4>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              expandedSections.appointmentType ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {expandedSections.appointmentType && (
          <div id="appointment-type-content" className="mt-4 space-y-2">
            {['In-Person', 'Home Visit', 'Phone Consultation'].map((type) => {
              const isChecked = filters.appointmentType === type;
              return (
                <div key={type} className="relative">
                  <input
                    id={`radio-${type}`}
                    name="appointment-type"
                    type="radio"
                    checked={isChecked}
                    onChange={() =>
                      onChange({
                        ...filters,
                        appointmentType: type as any,
                      })
                    }
                    className="sr-only peer"
                    aria-label={`${type} appointments`}
                  />
                  <label
                    htmlFor={`radio-${type}`}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 
                          border-2 rounded-lg cursor-pointer 
                          transition-all duration-200 
                          hover:border-blue-300 hover:bg-blue-50/50
                          peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 
                          peer-focus-visible:outline-blue-500 w-full
                          ${
                            isChecked
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                  >
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center
                          ${
                            isChecked
                              ? 'border-blue-500 bg-white'
                              : 'border-gray-300 bg-white'
                          }`}
                    >
                      {isChecked && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium
                          ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}
                    >
                      {type}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- PRICE RANGE SECTION --- */}
      <div className="px-6 py-4">
        <button
          onClick={() => toggleSection('priceRange')}
          className="w-full flex items-center justify-between py-2 hover:opacity-75 transition-opacity"
          aria-expanded={expandedSections.priceRange}
          aria-controls="price-range-content"
        >
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Consultation Fee (₵)
          </h4>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              expandedSections.priceRange ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {expandedSections.priceRange && (
          <div id="price-range-content" className="mt-4 space-y-3">
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
                  onChange({
                    ...filters,
                    minPrice: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    transition-all hover:border-gray-400"
                aria-label="Minimum consultation fee"
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
                  onChange({
                    ...filters,
                    maxPrice: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    transition-all hover:border-gray-400"
                aria-label="Maximum consultation fee"
              />
            </div>

            {/* Price Range Display */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200 text-center">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                Selected Range
              </p>
              <p className="text-base font-bold text-blue-600 mt-1">
                ₵{filters.minPrice} — ₵{filters.maxPrice}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarFilter;
