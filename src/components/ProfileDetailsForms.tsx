import React from 'react';
import type { IUserProfile } from '../types/user.ts';
import { useGetMaxDate } from '../hooks/useDate.ts';
import PhoneInput from './PhoneInput';
import {
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ProfileDetailsProp {
  user: IUserProfile;
  onChange: (field: keyof IUserProfile, value: string | string[]) => void;
  onSave: () => void;
  saveStatus: boolean;
}

const availableLanguages = [
  'English',
  'French',
  'German',
  'Spanish',
  'Asante Twi',
  'Ewe',
  'Ga',
  'Fante Twi',
  'Akuapem Twi',
  'Bono Twi',
  'Gonja',
  'Hausa',
  'Mamprusi',
  'Wale',
  'Yoruba',
  'Nzema',
  'Dagbani',
  'Dangme',
  'Dagaare',
  'Kasem',
];

const ProfileDetailsForm: React.FC<ProfileDetailsProp> = ({
  user,
  onChange,
  onSave,
  saveStatus,
}) => {
  const handleLanguageChange = (language: string) => {
    const currentLanguages = user.languages || [];
    if (currentLanguages.includes(language)) {
      // Remove language
      onChange(
        'languages',
        currentLanguages.filter((lang) => lang !== language)
      );
    } else {
      // Add language
      onChange('languages', [...currentLanguages, language]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Personal Information Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-blue-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Title
            </label>
            <select
              id="title"
              name="title"
              value={user.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
              <option value="Rev">Rev</option>
              <option value="Sir">Sir</option>
              <option value="Lady">Lady</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName || ''}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="John"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName || ''}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={user.gender || ''}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-green-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"
            >
              <EnvelopeIcon className="h-3.5 w-3.5" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
            />
            <p className="mt-0.5 text-xs text-gray-500">Cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <PhoneInput
              id="phone"
              name="phone"
              value={user.phone || ''}
              onChange={(value) => onChange('phone', value)}
              required={false}
              showOperatorInfo={true}
              variant="compact"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"
            >
              <MapPinIcon className="h-3.5 w-3.5" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={user.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Accra"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Address & Demographics Section */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <HomeIcon className="h-4 w-4 text-purple-600" />
          Address & Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Address */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label
              htmlFor="address"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={user.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="123 Main St"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              DOB
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              max={useGetMaxDate()}
              value={
                user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="mt-0.5 text-xs text-gray-500">Must be 18+</p>
          </div>

          {/* Role */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="role"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              disabled
              value={user.role?.toUpperCase() || ''}
              onChange={(e) => onChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-amber-600" />
          Languages Spoken
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {availableLanguages.map((language) => (
            <label
              key={language}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm group border border-transparent hover:border-amber-300"
            >
              <input
                type="checkbox"
                checked={(user.languages || []).includes(language)}
                onChange={() => handleLanguageChange(language)}
                className="w-4 h-4 text-amber-600 border-2 border-gray-300 rounded cursor-pointer focus:ring-amber-500 transition-colors hover:border-amber-500 group-hover:border-amber-500"
              />
              <span className="text-xs font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                {language}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-600 font-medium">
          Select languages you speak fluently
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={saveStatus}
          className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saveStatus ? '✓ Changes Saved' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
