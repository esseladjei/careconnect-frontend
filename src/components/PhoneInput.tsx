import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { validateGhanaPhoneNumber } from '../utils/phoneValidation';

type StyleVariant = 'default' | 'compact' | 'registration';

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
  variant?: StyleVariant;
  labelClassName?: string;
  inputClassName?: string;
  showIcon?: boolean;
}

/**
 * Reusable Ghana phone number input component
 * Provides validation feedback and operator information
 *
 * @param variant - Style variant: 'default' (compact profile), 'registration' (larger registration form), 'compact' (smallest)
 * @param className - Custom container classes (overrides variant)
 * @param labelClassName - Custom label classes (overrides variant)
 * @param inputClassName - Custom input classes (overrides variant)
 * @param showIcon - Show phone icon next to label (default: true for compact, false for registration)
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
  variant = 'default',
  labelClassName = '',
  inputClassName = '',
  showIcon,
}) => {
  const [operator, setOperator] = React.useState<string | null>(null);

  // Determine if icon should be shown
  const shouldShowIcon =
    showIcon !== undefined
      ? showIcon
      : variant === 'compact' || variant === 'default';

  // Get variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          label: 'block text-xs font-semibold text-gray-600 mb-1',
          input:
            'w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none transition-colors',
          helperMargin: 'mt-0.5',
          iconSize: 'h-3.5 w-3.5',
        };
      case 'registration':
        return {
          label: 'block text-xs font-semibold text-gray-600 mb-1',
          input:
            'w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none transition-colors',
          helperMargin: 'mt-1',
          iconSize: 'h-3.5 w-3.5',
        };
      case 'default':
      default:
        return {
          label: 'block text-xs font-semibold text-gray-600 mb-1',
          input:
            'w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none transition-colors',
          helperMargin: 'mt-0.5',
          iconSize: 'h-3.5 w-3.5',
        };
    }
  };

  const styles = getVariantStyles();

  // Get focus and error styles based on variant
  const getInputStateStyles = () => {
    // All variants now use the same clean focus style
    return error
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500';
  };

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
    <div className={className || 'flex flex-col'}>
      <label
        htmlFor={id}
        className={
          labelClassName ||
          `${styles.label} ${shouldShowIcon ? 'flex items-center gap-1' : ''}`
        }
      >
        {shouldShowIcon && <PhoneIcon className={styles.iconSize} />}
        Phone Number{' '}
        <span className={required ? `text-red-500` : ''}>
          {required ? '*' : ''}
        </span>
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
        className={
          inputClassName ||
          `${styles.input} ${getInputStateStyles()} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`
        }
      />

      {/* Operator Info */}
      {showOperatorInfo && operator && !error && (
        <p
          className={`text-green-600 text-xs font-medium ${styles.helperMargin}`}
        >
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
        <p
          id={`${id}-error`}
          className={`text-red-600 text-xs font-medium ${styles.helperMargin}`}
        >
          {error}
        </p>
      )}

      {/* Help Text */}
      {!error && (
        <p className={`text-gray-500 text-xs ${styles.helperMargin}`}>
          Ghana number: MTN (024-025-055-056), Vodafone (020-050), AirtelTigo
          (027-057), or Landline (03-06)
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
