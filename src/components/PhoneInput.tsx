import React from 'react';
import { validateGhanaPhoneNumber } from '../utils/phoneValidation';

interface PhoneInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showOperatorInfo?: boolean;
  className?: string;
}

/**
 * Reusable Ghana phone number input component
 * Provides validation feedback and operator information
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = 'e.g., 024XXXXXXX or 0XX-XXX-XXXX',
  disabled = false,
  showOperatorInfo = true,
  className = '',
}) => {
  const [operator, setOperator] = React.useState<string | null>(null);

  // Validate value when it changes (including initial mount)
  React.useEffect(() => {
    if (showOperatorInfo && value.trim()) {
      const validation = validateGhanaPhoneNumber(value);
      setOperator(validation.operator || null);
    } else {
      setOperator(null);
    }
  }, [value, showOperatorInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-900 mb-2"
      >
        Phone Number {required ? '*' : ''}
      </label>
      <input
        type="tel"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none transition-all duration-200 ${
          error
            ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />

      {/* Operator Info */}
      {showOperatorInfo && operator && !error && (
        <p className="text-green-600 text-xs font-medium mt-2">
          ✓{' '}
          {operator === 'MTN'
            ? 'MTN Ghana'
            : operator === 'VODAFONE'
              ? 'Vodafone Ghana'
              : operator === 'AIRTELTIGO'
                ? 'AirtelTigo Ghana'
                : 'Local Telephone'}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm font-medium mt-2">
          {error}
        </p>
      )}

      {/* Help Text */}
      {!error && (
        <p className="text-gray-500 text-xs mt-2">
          Ghana number: MTN (024-025-055-056), Vodafone (020-050), AirtelTigo
          (027-057), or Landline (03-06)
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
