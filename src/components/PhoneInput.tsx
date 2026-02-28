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
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"
      >
        Phone Number {required ? '*' : '(Optional)'}
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
        className={`${className} ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />

      {/* Operator Info */}
      {showOperatorInfo && operator && !error && (
        <p className="text-green-600 text-xs mt-1 font-medium">
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

      {/* Help Text */}
      <p className="text-gray-500 text-xs mt-1">
        Ghana number: MTN (024-025-055-056), Vodafone (020-050), AirtelTigo
        (027-057), or Landline (03-06)
      </p>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
