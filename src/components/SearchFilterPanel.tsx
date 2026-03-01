import React, { useEffect, useRef, useState } from 'react';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { filterLocations, useLocations } from '../hooks/useLocations';
import type { FilterParams, SearchParams } from '../types/search.ts';
import { useGetMonth, useGetToday } from '../hooks/useDate.ts';

interface Props {
  value: SearchParams;
  filters: FilterParams;
  onChange: (search: SearchParams) => void;
}

const SearchFilterPanel: React.FC<Props> = ({ value, filters, onChange }) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationInput, setLocationInput] = useState(value.location);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Fetch all available locations from DB using custom hook
  const { data: allLocations = [], isLoading: locationsLoading } =
    useLocations();

  // Filter locations based on input
  const filteredLocations = filterLocations(allLocations, locationInput);

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setLocationInput(location);
    onChange({ ...value, location });
    setShowLocationDropdown(false);
  };

  // Handle location input change
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLocationInput(input);
    onChange({ ...value, location: input });
    setShowLocationDropdown(input.length > 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="w-full -mt-16 relative z-20 mb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Card with Shadow */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-visible">
          {/* Search Header */}
          <div className="bg-gradient-to-r from-slate-700 via-blue-700 to-blue-800 px-6 sm:px-8 py-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Find Your Perfect Healthcare Provider
            </h2>
            <p className="text-blue-50 text-sm mt-1">
              Search by location, specialty, and availability
            </p>
          </div>

          {/* Search Form */}
          <form className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Location Input */}
              <div ref={locationInputRef} className="relative">
                <label
                  htmlFor="location-filter"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2"
                >
                  <MapPinIcon
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>Location</span>
                </label>
                <div className="relative">
                  <input
                    id="location-filter"
                    type="text"
                    placeholder="Enter city or area..."
                    value={locationInput}
                    onChange={handleLocationChange}
                    onFocus={() =>
                      locationInput.length > 0 && setShowLocationDropdown(true)
                    }
                    disabled={locationsLoading}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white/95 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      transition-all duration-200 hover:border-gray-300
                      disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400
                      font-medium text-gray-900"
                  />

                  {/* Autocomplete Dropdown */}
                  {showLocationDropdown && filteredLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                      {filteredLocations.map((location, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm
                            flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl 
                            border-b border-gray-100 last:border-b-0 font-medium text-gray-700
                            hover:text-blue-600"
                        >
                          <MapPinIcon
                            className="h-4 w-4 text-blue-500"
                            aria-hidden="true"
                          />
                          {location}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results message */}
                  {showLocationDropdown &&
                    locationInput.length > 0 &&
                    filteredLocations.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 text-center">
                        <p className="text-sm text-gray-500">
                          No locations found for "{locationInput}"
                        </p>
                      </div>
                    )}

                  {/* Loading indicator */}
                  {locationsLoading && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 text-center">
                      <p className="text-sm text-gray-500">
                        Loading locations...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="relative">
                <label
                  htmlFor="start-date-filter"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2"
                >
                  <CalendarDaysIcon
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>From</span>
                </label>
                <input
                  id="start-date-filter"
                  type="date"
                  min={useGetToday()}
                  max={value.endDate || useGetMonth()}
                  value={value.startDate}
                  onChange={(e) =>
                    onChange({ ...value, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white/95
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 hover:border-gray-300 font-medium text-gray-900"
                />
              </div>

              {/* End Date */}
              <div className="relative">
                <label
                  htmlFor="end-date-filter"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2"
                >
                  <CalendarDaysIcon
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>To</span>
                </label>
                <input
                  id="end-date-filter"
                  type="date"
                  min={value.startDate || useGetToday()}
                  max={useGetMonth()}
                  value={value.endDate}
                  onChange={(e) =>
                    onChange({ ...value, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white/95
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200 hover:border-gray-300 font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {filters.specialties.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Active Filters:
                  </span>
                  {filters.specialties.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200
                        hover:bg-blue-100 transition-colors"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterPanel;
