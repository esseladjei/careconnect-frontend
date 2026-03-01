import { useCallback, useState } from 'react';
import type { IPhoneValidationResult } from '../utils/phoneValidation';
import {
  convertToGhanaFormat,
  convertToInternationalFormat,
  validateGhanaPhoneNumber,
} from '../utils/phoneValidation';

/**
 * Custom hook for Ghana phone number validation
 * Provides validation state and utility functions
 */
export const usePhoneValidation = () => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [operator, setOperator] = useState<string | null>(null);

  /**
   * Validates a phone number and updates state
   */
  const validate = useCallback(
    (phoneNumber: string): IPhoneValidationResult => {
      const result = validateGhanaPhoneNumber(phoneNumber);

      setIsValid(result.isValid);
      setError(result.isValid ? null : result.message);
      setOperator(result.operator || null);

      return result;
    },
    []
  );

  /**
   * Clears validation state
   */
  const clear = useCallback(() => {
    setError(null);
    setIsValid(false);
    setOperator(null);
  }, []);

  /**
   * Converts to international format
   */
  const toInternational = useCallback((phoneNumber: string): string | null => {
    return convertToInternationalFormat(phoneNumber);
  }, []);

  /**
   * Converts to Ghana format
   */
  const toGhana = useCallback((phoneNumber: string): string | null => {
    return convertToGhanaFormat(phoneNumber);
  }, []);

  return {
    validate,
    clear,
    isValid,
    error,
    operator,
    toInternational,
    toGhana,
  };
};
