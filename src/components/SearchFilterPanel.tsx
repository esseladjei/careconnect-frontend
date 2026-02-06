import React, { useEffect, useRef, useState } from 'react';
import { filterLocations, useLocations } from '../hooks/useLocations';
import type { FilterParams, SearchParams } from '../types/search.ts';
import { useGetMonth, useGetToday } from '../hooks/useMaxDate.ts';

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
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
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
    <section className="container mx-auto mt-8">
      <div className="relative rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 shadow-lg p-5 sm:p-8">
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* Start Date */}
          <div>
            <label
              htmlFor="start-date-filter"
              className="block text-xs text-gray-600 mb-1"
            >
              Appointment From:
            </label>
            <input
              id="start-date-filter"
              type="date"
              min={useGetToday()}
              value={value.startDate}
              onChange={(e) =>
                onChange({ ...value, startDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="end-date-filter"
              className="block text-xs text-gray-600 mb-1"
            >
              Appointment To:
            </label>
            <input
              id="end-date-filter"
              type="date"
              max={useGetMonth()}
              value={value.endDate}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition"
            />
          </div>

          {/* Location with Autocomplete */}
          <div ref={locationInputRef} className="relative">
            <label
              htmlFor="location-filter"
              className="block text-xs text-gray-600 mb-1"
            >
              Location
            </label>
            <div className="relative">
              {/* Location Input with City Icon */}
              <input
                id="location-filter"
                type="text"
                placeholder="Search location..."
                value={locationInput}
                onChange={handleLocationChange}
                onFocus={() =>
                  locationInput.length > 0 && setShowLocationDropdown(true)
                }
                disabled={locationsLoading}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {/* City/Building Icon */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2h2v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>

              {/* Autocomplete Dropdown */}
              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                  {filteredLocations.map((location, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                    >
                      <svg
                        className="text-blue-600 w-4 h-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">
                        {location}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showLocationDropdown &&
                locationInput.length > 0 &&
                filteredLocations.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No locations found for "{locationInput}"
                    </p>
                  </div>
                )}

              {/* Loading indicator */}
              {locationsLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Loading locations...</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="sm:col-span-3 mt-2">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {filters.specialties.length > 0 && (
                <>
                  <span className="text-xs font-semibold text-gray-600">
                    Active filters:
                  </span>
                  {filters.specialties.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchFilterPanel;
