/**
 * Ghana Phone Number Validation Utility
 * Supports MTN, Vodafone, AirtelTigo, and local telephone numbers
 */

/**
 * Ghana mobile network operator prefixes
 */
export const GHANA_OPERATORS = {
  MTN: {
    name: 'MTN Ghana',
    prefixes: ['024', '025', '055', '056'],
  },
  VODAFONE: {
    name: 'Vodafone Ghana',
    prefixes: ['020', '050'],
  },
  AIRTELTIGO: {
    name: 'AirtelTigo Ghana',
    prefixes: ['027', '057'],
  },
  LANDLINE: {
    name: 'Local Telephone (Landline)',
    prefixes: ['031', '032', '034', '035', '036', '037', '038', '039'],
  },
};

/**
 * Represents the result of phone validation
 */
export interface IPhoneValidationResult {
  isValid: boolean;
  operator?: string;
  operatorName?: string;
  message: string;
  formattedNumber?: string;
}

/**
 * Formats a Ghana phone number to standard format
 * Accepts: 0XXXXXXXXXX, +233XXXXXXXXX, 233XXXXXXXXX, XXXXXXXXXX
 *
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number (with leading 0 for Ghana) or null if invalid
 */
export const formatGhanaPhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) return null;

  // Strip all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Convert +233XXXXXXXXX or 233XXXXXXXXX to 0XXXXXXXXX
  const normalized = digits.startsWith('233')
    ? '0' + digits.substring(3)
    : digits;

  // Validate: must be exactly 10 digits starting with 0
  if (!/^0\d{9}$/.test(normalized)) {
    return null;
  }

  return normalized;
};

/**
 * Identifies the operator from a Ghana phone number
 *
 * @param phoneNumber - The formatted Ghana phone number (0XXXXXXXXXX)
 * @returns Operator key or null if not recognized
 */
export const identifyOperator = (phoneNumber: string): string | null => {
  const prefix = phoneNumber.substring(0, 3);

  for (const [operator, data] of Object.entries(GHANA_OPERATORS)) {
    if (data.prefixes.includes(prefix)) {
      return operator;
    }
  }

  return null;
};

/**
 * Validates a Ghana phone number
 * Checks format and operator support
 *
 * @param phoneNumber - The phone number to validate
 * @returns PhoneValidationResult with validation details
 */
export const validateGhanaPhoneNumber = (
  phoneNumber: string
): IPhoneValidationResult => {
  // Check if phone number is provided
  if (!phoneNumber) {
    return {
      isValid: false,
      message: 'Phone number is required',
    };
  }

  // Trim whitespace
  const trimmed = phoneNumber.trim();

  if (!trimmed) {
    return {
      isValid: false,
      message: 'Phone number is required',
    };
  }

  // Format the phone number
  const formatted = formatGhanaPhoneNumber(trimmed);

  if (!formatted) {
    return {
      isValid: false,
      message:
        'Invalid phone number format. Please use format: 024XXXXXXX or +233XXXXXXXXX',
    };
  }

  // Identify operator
  const operator = identifyOperator(formatted);

  if (!operator) {
    return {
      isValid: false,
      message:
        'Phone number does not belong to a recognized Ghana operator (MTN, Vodafone, AirtelTigo)',
    };
  }

  const operatorData =
    GHANA_OPERATORS[operator as keyof typeof GHANA_OPERATORS];

  return {
    isValid: true,
    operator,
    operatorName: operatorData.name,
    message: `Valid ${operatorData.name} number`,
    formattedNumber: formatted,
  };
};

/**
 * Validates a phone number (Ghana or international format)
 * If international format is detected, validates as Ghana number
 *
 * @param phoneNumber - The phone number to validate
 * @returns true if valid, false otherwise
 */
export const isValidGhanaPhoneNumber = (phoneNumber: string): boolean => {
  const result = validateGhanaPhoneNumber(phoneNumber);
  return result.isValid;
};

/**
 * Gets all valid Ghana phone number prefixes by operator
 *
 * @returns Object mapping operator codes to their prefixes
 */
export const getOperatorPrefixes = (): Record<string, string[]> => {
  const prefixes: Record<string, string[]> = {};

  for (const [operator, data] of Object.entries(GHANA_OPERATORS)) {
    prefixes[operator] = data.prefixes;
  }

  return prefixes;
};

/**
 * Gets operator information
 *
 * @param operator - The operator code (MTN, VODAFONE, AIRTELTIGO, LANDLINE)
 * @returns Operator information or null if not found
 */
export const getOperatorInfo = (
  operator: string
): { name: string; prefixes: string[] } | null => {
  const operatorKey = operator.toUpperCase() as keyof typeof GHANA_OPERATORS;
  return GHANA_OPERATORS[operatorKey] || null;
};

/**
 * Converts international format to Ghana format
 * E.g., +233201234567 → 0201234567
 *
 * @param internationalNumber - The international formatted number
 * @returns Ghana formatted number or null if invalid
 */
export const convertToGhanaFormat = (
  internationalNumber: string
): string | null => {
  const formatted = formatGhanaPhoneNumber(internationalNumber);
  return formatted;
};

/**
 * Converts Ghana format to international format
 * E.g., 0201234567 → +233201234567
 *
 * @param ghanaNumber - The Ghana formatted number
 * @returns International formatted number or null if invalid
 */
export const convertToInternationalFormat = (
  ghanaNumber: string
): string | null => {
  const formatted = formatGhanaPhoneNumber(ghanaNumber);

  if (!formatted) {
    return null;
  }

  // Replace leading 0 with country code 233
  return '+233' + formatted.substring(1);
};

/**
 * Batch validates multiple phone numbers
 *
 * @param phoneNumbers - Array of phone numbers to validate
 * @returns Array of validation results
 */
export const validateMultiplePhoneNumbers = (
  phoneNumbers: string[]
): IPhoneValidationResult[] => {
  return phoneNumbers.map((phone) => validateGhanaPhoneNumber(phone));
};

/**
 * Checks if a phone number belongs to a specific operator
 *
 * @param phoneNumber - The phone number to check
 * @param operator - The operator to check against (MTN, VODAFONE, AIRTELTIGO, LANDLINE)
 * @returns true if the number belongs to the operator, false otherwise
 */
export const isOperatorPhoneNumber = (
  phoneNumber: string,
  operator: string
): boolean => {
  const result = validateGhanaPhoneNumber(phoneNumber);

  if (!result.isValid) {
    return false;
  }

  return result.operator?.toUpperCase() === operator.toUpperCase();
};

/**
 * Gets a list of all supported Ghana operators
 *
 * @returns Array of operator names
 */
export const getSupportedOperators = (): string[] => {
  return Object.values(GHANA_OPERATORS).map((op) => op.name);
};

/**
 * Generates a regex pattern for Ghana phone validation
 * Can be used for HTML5 input pattern attribute
 *
 * @returns Regex pattern string for Ghana phone numbers
 */
export const getGhanaPhoneRegexPattern = (): string => {
  // Pattern: 0 followed by 2 digits from supported prefixes, then 7 more digits
  // This matches all Ghana mobile and landline formats
  return '^0[2,3,5,6][0-9]{8}$';
};
