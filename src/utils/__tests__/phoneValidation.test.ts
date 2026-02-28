import { describe, expect, it } from 'vitest';
import {
  formatGhanaPhoneNumber,
  isValidGhanaPhoneNumber,
  validateGhanaPhoneNumber,
} from '../phoneValidation';

describe('Ghana Phone Validation - Unit Tests', () => {
  describe('validateGhanaPhoneNumber', () => {
    it('should validate MTN numbers correctly', () => {
      const result = validateGhanaPhoneNumber('0241234567');
      expect(result.isValid).toBe(true);
      expect(result.operator).toBe('MTN');
      expect(result.operatorName).toBe('MTN Ghana');
    });

    it('should validate Vodafone numbers correctly', () => {
      const result = validateGhanaPhoneNumber('0501234567');
      expect(result.isValid).toBe(true);
      expect(result.operator).toBe('VODAFONE');
      expect(result.operatorName).toBe('Vodafone Ghana');
    });

    it('should validate AirtelTigo numbers correctly', () => {
      const result = validateGhanaPhoneNumber('0271234567');
      expect(result.isValid).toBe(true);
      expect(result.operator).toBe('AIRTELTIGO');
    });

    it('should validate Landline numbers correctly', () => {
      const result = validateGhanaPhoneNumber('0322012345');
      expect(result.isValid).toBe(true);
      expect(result.operator).toBe('LANDLINE');
    });

    it('should reject invalid phone numbers', () => {
      const result = validateGhanaPhoneNumber('123456');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid');
    });

    it('should accept formatted input with spaces', () => {
      const result = validateGhanaPhoneNumber('024 123 4567');
      expect(result.isValid).toBe(true);
      expect(result.formattedNumber).toBe('0241234567');
    });

    it('should accept international format', () => {
      const result = validateGhanaPhoneNumber('+233241234567');
      expect(result.isValid).toBe(true);
      expect(result.formattedNumber).toBe('0241234567');
    });

    it('should return error message for empty input', () => {
      const result = validateGhanaPhoneNumber('');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });
  });

  describe('isValidGhanaPhoneNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidGhanaPhoneNumber('0241234567')).toBe(true);
      expect(isValidGhanaPhoneNumber('0501234567')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidGhanaPhoneNumber('123456')).toBe(false);
      expect(isValidGhanaPhoneNumber('invalid')).toBe(false);
    });
  });

  describe('formatGhanaPhoneNumber', () => {
    it('should format Ghana numbers correctly', () => {
      expect(formatGhanaPhoneNumber('0241234567')).toBe('0241234567');
    });

    it('should format international numbers to Ghana format', () => {
      expect(formatGhanaPhoneNumber('+233241234567')).toBe('0241234567');
      expect(formatGhanaPhoneNumber('233241234567')).toBe('0241234567');
    });

    it('should handle numbers with spaces and dashes', () => {
      expect(formatGhanaPhoneNumber('024 123 4567')).toBe('0241234567');
      expect(formatGhanaPhoneNumber('024-123-4567')).toBe('0241234567');
    });

    it('should return null for invalid formats', () => {
      expect(formatGhanaPhoneNumber('123456')).toBeNull();
    });
  });
});
