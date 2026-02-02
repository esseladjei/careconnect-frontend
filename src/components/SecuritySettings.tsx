import React, { useState } from 'react';
import type { UserPassword } from '../types/user.ts';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface SecuritySettingsProps {
  onChange: (field: keyof UserPassword, value: string) => void;
  onPasswordSave: () => void;
  savePasswordStatus: boolean;
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
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
}) => {
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSave();
  };

  return (
    <div className="space-y-8">
      {/* Password Change */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Change Password
        </h3>
        <form
          onSubmit={handlePasswordChangeSubmit}
          className="space-y-4 max-w-lg"
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
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {savePasswordStatus ? 'Password changed...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Deactivation (Placeholder) */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Account Deactivation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
          Deactivate Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
