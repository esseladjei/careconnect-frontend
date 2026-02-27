import React, { useState } from 'react';
import type { UserPassword } from '../types/user.ts';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface SecuritySettingsProps {
  onChange: (field: keyof UserPassword, value: string) => void;
  onPasswordSave: () => void;
  savePasswordStatus: boolean;
  onLogoutAll: () => void;
}

interface PasswordInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
}

// Reusable Password Input Component with visibility toggle
const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  onChange,
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-gray-700 uppercase mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// --- Sub-Component: Security Settings Form ---
const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onChange,
  onPasswordSave,
  savePasswordStatus,
  onLogoutAll,
}) => {
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSave();
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Change Password
        </h3>
        <form
          onSubmit={handlePasswordChangeSubmit}
          className="space-y-3 max-w-md"
        >
          <PasswordInput
            id="current-password"
            label="Current Password"
            onChange={(value) => onChange('oldPassword', value)}
            required
          />
          <PasswordInput
            id="new-password"
            label="New Password"
            onChange={(value) => onChange('newPassword', value)}
            required
          />
          <PasswordInput
            id="confirm-new-password"
            label="Confirm New Password"
            onChange={(value) => onChange('confirmNewPassword', value)}
            required
          />
          <button
            type="submit"
            disabled={savePasswordStatus}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {savePasswordStatus ? '✓ Password updated' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Deactivation */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Account Deactivation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
          Deactivate Account
        </button>
      </div>

      {/* Logout all devices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Logout All Devices
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sign out of your account on all devices for security.
        </p>
        <button
          type="button"
          onClick={onLogoutAll}
          className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Log out all devices
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
