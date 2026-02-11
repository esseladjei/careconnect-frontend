import React from 'react';
import type { UserProfile } from '../types/user.ts';
import { useGetMaxDate } from '../hooks/useDate.ts';

interface ProfileDetailsProp {
  user: UserProfile;
  onChange: (field: keyof UserProfile, value: string | string[]) => void;
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            title
          </label>
          <select
            id="title"
            name="title"
            value={user.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        {/* Gender */}
        <div>
          <label
            htmlFor="Gender"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <select
            id="gender"
            name="gender"
            value={user.gender || ''}
            onChange={(e) => onChange('gender', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Email (Disabled/Read-only example) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email || ''}
            disabled
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed here.
          </p>
        </div>

        {/* DOB */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date Of Birth
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
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be 18 years old or above
          </p>
        </div>
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={user.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        {/* Address */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="tel"
            id="address"
            name="address"
            value={user.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={user.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Languages Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Languages Spoken
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
          {availableLanguages.map((language) => (
            <label
              key={language}
              className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={(user.languages || []).includes(language)}
                onChange={() => handleLanguageChange(language)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Select one or more languages you speak
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={saveStatus}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50"
        >
          {saveStatus ? 'Changed Saved' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
