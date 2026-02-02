import React from 'react';
import type { User } from '../types/user.ts';

interface ProfileDetailsProp {
  user: User;
  onChange: (field: keyof User, value: string) => void;
  onSave: () => void;
  saveStatus: boolean;
}

const ProfileDetailsForm: React.FC<ProfileDetailsProp> = ({
  user,
  onChange,
  onSave,
  saveStatus,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={user.firstName}
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
            value={user.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

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
          value={user.email}
          disabled
          className="mt-1 w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Email cannot be changed here.
        </p>
      </div>

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
          value={user.phone}
          onChange={(e) => onChange('phone', e.target.value)}
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
          value={user.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
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
