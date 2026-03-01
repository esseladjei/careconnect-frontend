import React from 'react';
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  LanguageIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import useCapitalizeFirst from '../../hooks/useCapitalizeFirst';
import type { IProviderListing } from '../../types/providerListing.ts';

interface Props {
  offer: IProviderListing;
}

const OverviewTab: React.FC<Props> = ({ offer }) => {
  const primarySpecialty =
    offer.provider.specialties?.[0] || 'Healthcare Provider';

  return (
    <div className="space-y-6 p-6">
      {/* About Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-blue-600" />
          About {offer.user.title} {useCapitalizeFirst(offer.user.lastName)}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {offer.user.title} {useCapitalizeFirst(offer.user.lastName)} is a
          highly qualified{' '}
          <span className="font-bold italic">{primarySpecialty}</span>
          {offer.provider.experience >= 2 && (
            <>
              {' '}with {offer.provider.experience} years of professional
              experience
            </>
          )}{' '}
          in the healthcare industry. Dedicated to providing exceptional
          patient care and maintaining the highest
          standards of medical practice.
        </p>
      </section>

      {/* Professional Details Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Professional Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offer.provider.practiceName && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-100 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <BuildingOffice2Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wide">
                    Practice
                  </dt>
                  <dd className="text-slate-900 font-semibold">
                    {offer.provider.practiceName}
                  </dd>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-50 to-emerald-100 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wide">
                  Status
                </dt>
                <dd className="text-slate-900 font-semibold flex items-center gap-2">
                  {useCapitalizeFirst(
                    offer.provider.providerStatus || 'Active'
                  )}
                  {offer.provider.providerStatus === 'verified' && (
                    <CheckBadgeIcon className="w-5 h-5 text-emerald-600" />
                  )}
                </dd>
              </div>
            </div>
          </div>

          {offer.user.gender && (
            <div className="bg-gradient-to-br from-slate-50 to-violet-100 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wide">
                    Gender
                  </dt>
                  <dd className="text-slate-900 font-semibold">
                    {offer.user.gender}
                  </dd>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-50 to-amber-100 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wide">
                  Appointment Type
                </dt>
                <dd className="text-slate-900 font-semibold">
                  {offer.appointmentType}
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-fuchsia-100 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-fuchsia-600 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wide">
                  Service Description
                </dt>
                <dd className="text-slate-900 font-semibold">
                  {offer.provider.serviceDescription}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      {offer.provider.specialties && offer.provider.specialties.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Areas of Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {offer.provider.specialties.map((specialty, index) => (
              <span
                key={`specialty-${index}`}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold border-2 border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                {specialty}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {offer.user.languages && offer.user.languages.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LanguageIcon className="w-6 h-6 text-blue-600" />
            Languages Spoken
          </h2>
          <div className="flex flex-wrap gap-3">
            {offer.user.languages.map((language, index) => (
              <span
                key={`language-${index}`}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold border-2 border-blue-200"
              >
                {language}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Contact Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
            <a
              href={`mailto:${offer.user.email}`}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              {offer.user.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPinIcon className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{offer.location}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;
