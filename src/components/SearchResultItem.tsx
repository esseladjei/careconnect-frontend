import React from 'react';
import { Link } from 'react-router-dom';
import {
  BeakerIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { SearchResult } from '../types/search.ts';
import { useGetDayMonthOnly } from '../hooks/useDate.ts';
import useCapitalizeFirst from '../hooks/useCapitalizeFirst.ts';
import ProviderRatingBadge from './reviews/ProviderRatingBadge';

interface SearchResultItemProps {
  result: SearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  const providerName = `${result.user.title} ${useCapitalizeFirst(result.user.firstName)} ${useCapitalizeFirst(result.user.lastName)}`;
  const pricePerHour = result.availability.price;
  const startDate = useGetDayMonthOnly(result.availability.start);
  const endDate = useGetDayMonthOnly(result.availability.end);
  const availabilityStatus = useCapitalizeFirst(
    result.provider.available || ''
  );
  return (
    <article
      className="bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-lg 
        border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300
        group hover:transform hover:-translate-y-1"
      aria-label={`${providerName} - Healthcare Provider`}
    >
      {/* Image Banner / Gradient Header */}
      <div className="relative h-24 bg-gradient-to-r from-slate-700 via-blue-700 to-blue-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <BeakerIcon
            className="absolute top-2 right-4 h-8 w-8 text-white"
            aria-hidden="true"
          />
          <BuildingOffice2Icon
            className="absolute bottom-1 left-2 h-7 w-7 text-white"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Header Section with Avatar - Overlapping */}
      <div className="px-6 pb-4 pt-0 relative">
        <div className="flex items-start gap-4 -mt-10 mb-3">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 
              flex items-center justify-center shrink-0 text-4xl shadow-xl 
              border-4 border-white group-hover:scale-105 transition-transform duration-300"
            role="img"
            aria-label={`${providerName} avatar`}
          >
            <UserCircleIcon
              className="h-12 w-12 text-white"
              aria-hidden="true"
            />
          </div>

          {/* Provider Name and Price */}
          <div className="flex-1 min-w-0 mt-2">
            <h2 className="text-lg font-bold text-white leading-tight truncate">
              {providerName}
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">
                ₵{pricePerHour}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                per session
              </span>
            </div>
            <div className="mt-2">
              <ProviderRatingBadge providerId={result.provider._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-5 space-y-4">
        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2">
          {/* Gender Badge */}
          {result.user.gender && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 font-semibold text-xs">
              <UserIcon
                className="h-3.5 w-3.5 text-gray-500"
                aria-hidden="true"
              />
              {result.user.gender}
            </span>
          )}

          {/* Availability Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full text-green-700 font-semibold text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {availabilityStatus}
          </span>

          {/* Verification Badge */}
          {result.provider.providerStatus && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 rounded-full text-blue-700 font-semibold text-xs">
              <span>✓</span> Verified
            </span>
          )}
        </div>
        {/* Location */}
        <div className="flex items-start gap-2 py-2 px-3 bg-gray-50 rounded-xl">
          <MapPinIcon
            className="h-5 w-5 text-gray-500 shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 font-medium truncate">
              {result.availability.location}
            </p>
          </div>
        </div>{' '}
        {/* Professional Details */}
        {(result.provider.experience !== undefined ||
          result.provider.practiceName ||
          result.provider.providerStatus) && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-2">
              {result.provider.experience !== undefined && (
                <div className="flex items-center justify-between py-2 px-0">
                  <span className="text-sm font-semibold text-gray-600">
                    Experience
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {result.provider.experience} year
                    {result.provider.experience !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {result.provider.practiceName && (
                <div className="flex items-center justify-between py-2 px-0">
                  <span className="text-sm font-semibold text-gray-600">
                    Practice
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right truncate ml-2">
                    {result.provider.practiceName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Languages Section */}
        {result.provider.languages && result.provider.languages.length > 0 && (
          <div className="py-2">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.provider.languages.map((language, index) => (
                <span
                  key={`language-${index}`}
                  className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-colors"
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
            <div className="py-2">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.provider.specialties.map((specialty, index) => (
                  <span
                    key={`specialty-${index}`}
                    className="inline-block px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-200 transition-colors"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        {/* Availability Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Available Dates
            </h4>
            <p className="text-sm text-gray-800 font-semibold">
              <span className="text-blue-600">{startDate}</span>
              <span className="text-gray-400 mx-2">—</span>
              <span className="text-blue-600">{endDate}</span>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Type of Appointment
            </h4>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200">
              {result.availability.appointmentType === 'Phone Call' ? (
                <PhoneIcon
                  className="h-5 w-5 text-blue-600"
                  aria-hidden="true"
                />
              ) : (
                <BuildingOffice2Icon
                  className="h-5 w-5 text-blue-600"
                  aria-hidden="true"
                />
              )}
              <span className="text-sm font-semibold text-gray-800">
                {result.availability.appointmentType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 group-hover:bg-white transition-colors">
        <Link
          to={`/offerdetails/${result.id}`}
          className="block w-full px-4 py-3 text-center text-base font-semibold text-white 
            bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
            active:from-blue-800 active:to-blue-900 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5"
          aria-label={`Book appointment with ${providerName}`}
        >
          Book Appointment →
        </Link>
      </div>
    </article>
  );
};

export default SearchResultItem;
