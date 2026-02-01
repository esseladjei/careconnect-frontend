import React from "react";
import type {SearchParams, FilterParams} from "../types/search.ts";

interface Props {
    value: SearchParams;
    filters: FilterParams;
    onChange: (search: SearchParams) => void;
}

const SearchFilterPanel: React.FC<Props> = ({ value, filters, onChange }) => {
  return (
    <section className="container mx-auto mt-8">
      <div className="relative rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 shadow-lg p-5 sm:p-8">
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* Date */}
          <div>
            <label htmlFor="date-filter" className="block text-xs text-gray-600 mb-1">
              Start Date
            </label>
            <input
              id="start-date-filter"
              type="date"
              value={value.startDate}
              onChange={(e) =>
                  onChange({ ...value, startDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="date-filter" className="block text-xs text-gray-600 mb-1">
              End Date
            </label>
            <input
                id="end-date-filter"
                type="date"
                value={value.endDate}
                onChange={(e) =>
                    onChange({ ...value, endDate: e.target.value })
                }
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
              placeholder="Location"
              value={value.location}
              onChange={(e) =>
                  onChange({ ...value, location: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Optional compact "more filters" row */}
          <div className="sm:col-span-3 mt-2">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {
                filters.specializations.map(((item)=>
                    <span key={item} className="px-2 py-1 rounded bg-gray-100">{item}</span>
                ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchFilterPanel;