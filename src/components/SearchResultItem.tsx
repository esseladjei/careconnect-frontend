import React from 'react';
import { Link } from 'react-router-dom';
import type { SearchResult } from '../types/search.ts';
import { useGetDayMonthOnly } from '../hooks/useDate.ts';
import useCapitalizeFirst from '../hooks/useCapitalizeFirst.ts';
import { CheckBadgeIcon } from '@heroicons/react/16/solid';

interface SearchResultItemProps {
  result: SearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  const providerName = `${result.user.title} ${useCapitalizeFirst(result.user.firstName)} ${useCapitalizeFirst(result.user.lastName)}`;
  const pricePerHour = result.availability.price;
  const startDate = useGetDayMonthOnly(result.availability.start);
  const endDate = useGetDayMonthOnly(result.availability.end);
  const verificationStatus = useCapitalizeFirst(
    result.provider.providerStatus || ''
  );
  const availabilityStatus = useCapitalizeFirst(
    result.provider.available || ''
  );
  return (
    <article
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 
        border border-gray-200 hover:border-blue-300 overflow-hidden flex flex-col h-full
        hover:transform hover:scale-105 group"
      aria-label={`${providerName} - Healthcare Provider`}
    >
      {/* Header Section with Avatar */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center 
              shrink-0 text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300"
            role="img"
            aria-label={`${providerName} avatar`}
          >
            👨‍⚕️
          </div>

          {/* Provider Name and Price */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 leading-tight truncate">
              {providerName}
            </h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">
                Gh¢ {pricePerHour}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                / Booking session
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-5 space-y-5">
        {/* Quick Info Row */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Gender Badge */}
          {result.user.gender && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Gender:</span>
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium text-xs">
                {result.user.gender}
              </span>
            </div>
          )}

          {/* Availability Badge */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Status:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-green-700 font-medium text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {availabilityStatus}
            </span>
          </div>

          {/* Location */}
          <div className="col-span-2 flex items-start gap-2">
            <span className="text-lg mt-0.5">📍</span>
            <div className="flex-1">
              <span className="text-gray-600 font-medium block text-xs mb-1">
                Location
              </span>
              <p className="text-gray-800 text-sm font-medium truncate">
                {result.availability.location}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        {(result.provider.experience !== undefined ||
          result.provider.practiceName ||
          result.provider.providerStatus) && (
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Professional Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {result.provider.experience !== undefined && (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <dt className="text-xs font-semibold text-gray-500">
                    Experience
                  </dt>
                  <dd className="text-gray-800 font-medium">
                    {result.provider.experience} Year(s)
                  </dd>
                </div>
              )}
              {result.provider.practiceName && (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <dt className="text-xs font-semibold text-gray-500">
                    Affiliate Practice Name
                  </dt>
                  <dd className="text-gray-800 font-medium truncate">
                    {result.provider.practiceName}
                  </dd>
                </div>
              )}
              {result.provider.providerStatus && (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <dt className="text-xs font-semibold text-gray-500">
                    Verification Status
                  </dt>
                  <dd className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-green-700 font-medium text-xs">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                    {verificationStatus}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Languages Section */}
        {result.provider.languages && result.provider.languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.provider.languages.map((language, index) => (
                <span
                  key={`language-${index}`}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialties Section */}
        {result.provider.specialties &&
          result.provider.specialties.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.provider.specialties.map((specialty, index) => (
                  <span
                    key={`specialty-${index}`}
                    className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Availability Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Available Dates
          </h3>
          <p className="text-sm text-gray-800 font-medium">
            <span className="text-blue-600 font-bold">{startDate}</span>
            <span className="text-gray-500 mx-2">—</span>
            <span className="text-blue-600 font-bold">{endDate}</span>
          </p>

          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-3 mb-2">
            Appointment Type
          </h3>
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200">
            <span className="text-lg">
              {result.availability.appointmentType === 'Phone Call'
                ? '📞'
                : '🏥'}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {result.availability.appointmentType}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <Link
          to={`/offerdetails/${result.id}`}
          className="block w-full px-4 py-3 text-center text-base font-semibold text-white 
            bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-blue-300
            transition-all duration-200 transform hover:-translate-y-0.5"
          aria-label={`Book appointment with ${providerName}`}
        >
          Book Appointment
        </Link>
      </div>
    </article>
  );
};

export default SearchResultItem;
