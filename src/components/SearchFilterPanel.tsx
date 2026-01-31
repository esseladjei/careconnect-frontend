import React from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

const SearchFilterPanel: React.FC = () => {
  return (
    <section className="container mx-auto mt-8">
      <div className="relative rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 shadow-lg p-5 sm:p-8">
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* Date */}
          <div>
            <label htmlFor="date-filter" className="block text-xs text-gray-600 mb-1">
              Date
            </label>
            <input
              id="date-filter"
              type="date"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location-filter" className="block text-xs text-gray-600 mb-1">
              Location
            </label>
            <input
              id="location-filter"
              type="text"
              placeholder="e.g., London"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Specialisation + Search button */}
          <div className="sm:col-span-1">
            <label htmlFor="specialisation-filter" className="block text-xs text-gray-600 mb-1">
              Specialisation
            </label>
            <div className="flex gap-2">
              <select
                id="specialisation-filter"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition appearance-none"
              >
                <option value="">All specialisations</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
              </select>

              <button
                type="button"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"              >
                 Search<MagnifyingGlassIcon className="h-6 w-6 inline-block mr-1 -mt-1"/>
              </button>
            </div>
          </div>

          {/* Optional compact "more filters" row */}
          <div className="sm:col-span-3 mt-2">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="px-2 py-1 rounded bg-gray-100">General Medicine</span>
              <span className="px-2 py-1 rounded bg-gray-100">Pediatrician</span>
              <span className="px-2 py-1 rounded bg-gray-100">Midwife</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchFilterPanel;