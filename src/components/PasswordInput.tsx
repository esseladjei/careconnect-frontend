import React from 'react';
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import type { PasswordRequirements } from '../utils/passwordValidation';
import {
  DEFAULT_PASSWORD_REQUIREMENTS,
  getPasswordChecklist,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthWidth,
  validatePassword,
} from '../utils/passwordValidation';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  showStrengthMeter?: boolean;
  showChecklist?: boolean;
  required?: boolean;
  disabled?: boolean;
  requirements?: PasswordRequirements;
  className?: string;
}

/**
 * Reusable password input component with strength meter and validation checklist
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  label = 'Password',
  placeholder = 'Enter your password',
  showStrengthMeter = true,
  showChecklist = true,
  required = true,
  disabled = false,
  requirements = DEFAULT_PASSWORD_REQUIREMENTS,
  className = '',
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const validation = validatePassword(value, requirements);
  const strengthLabel = getPasswordStrengthLabel(validation.strength);
  const strengthColor = getPasswordStrengthColor(validation.strength);
  const strengthWidth = getPasswordStrengthWidth(validation.strength);
  const checklist = getPasswordChecklist(value, requirements);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={`${className} flex flex-col`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-600 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Password Input Container */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm  text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />

        {/* Toggle Password Visibility */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${id}-error`}
          className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
        >
          <ExclamationCircleIcon className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Strength Meter */}
      {showStrengthMeter && value && (
        <div className="mt-2">
          {/* Strength Bar */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColor} transition-all duration-300 ${strengthWidth}`}
              />
            </div>
            <span className={`text-xs font-semibold ${strengthLabel.color}`}>
              {strengthLabel.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">{strengthLabel.description}</p>
        </div>
      )}

      {/* Validation Checklist */}
      {showChecklist && isFocused && value && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-1.5">
            Password Requirements:
          </p>
          <ul className="space-y-0.5">
            {checklist.map((item, index) => (
              <li
                key={index}
                className={`text-xs flex items-center gap-1.5 ${
                  item.met ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className={item.met ? 'font-bold' : ''}>{item.icon}</span>
                {item.requirement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Errors List */}
      {validation.errors.length > 0 && !error && value && (
        <div className="mt-2 space-y-1">
          {validation.errors.map((err, index) => (
            <p key={index} className="text-red-500 text-xs">
              • {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
