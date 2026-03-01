import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PASSWORD_REQUIREMENTS,
  getPasswordStrengthLabel,
  passwordsMatch,
  validatePassword,
  validatePasswordMatch,
} from '../../src/utils/passwordValidation';

describe('Password Validation - Unit Tests', () => {
  describe('validatePassword', () => {
    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.errors).toContain('Password is required');
    });

    it('should reject password that is too short', () => {
      const result = validatePassword('abc');
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('at least 8 characters'))
      ).toBe(true);
    });

    it('should reject password without uppercase letters', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('uppercase letter'))).toBe(
        true
      );
    });

    it('should reject password without lowercase letters', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('lowercase letter'))).toBe(
        true
      );
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('Password!@#');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('number'))).toBe(true);
    });

    it('should reject password without special characters', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('special character'))).toBe(
        true
      );
    });

    it('should reject password with weak patterns', () => {
      const result = validatePassword('Abcdefgh123!');
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('predictable patterns'))
      ).toBe(true);
    });

    it('should accept strong password', () => {
      const result = validatePassword('MyStr0ng!Pass');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.errors).toHaveLength(0);
    });

    it('should accept another strong password', () => {
      const result = validatePassword('SecureP@ssw0rd');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should calculate strength score', () => {
      const weak = validatePassword('Pass');
      const medium = validatePassword('Password1!');
      const strong = validatePassword('MyStr0ng!Pass');

      expect(weak.score).toBeLessThan(medium.score);
      expect(medium.score).toBeLessThan(strong.score);
    });

    it('should provide error messages', () => {
      const result = validatePassword('test');
      expect(result.message).toBeDefined();
      expect(result.message.length).toBeGreaterThan(0);
    });
  });

  describe('passwordsMatch', () => {
    it('should return true when passwords match', () => {
      expect(passwordsMatch('MyStr0ng!Pass', 'MyStr0ng!Pass')).toBe(true);
    });

    it('should return false when passwords do not match', () => {
      expect(passwordsMatch('MyStr0ng!Pass', 'DifferentPass1!')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(passwordsMatch('MyStr0ng!Pass', 'mystr0ng!pass')).toBe(false);
    });
  });

  describe('validatePasswordMatch', () => {
    it('should validate matching passwords', () => {
      const result = validatePasswordMatch('MyStr0ng!Pass', 'MyStr0ng!Pass');
      expect(result.isValid).toBe(true);
    });

    it('should reject non-matching passwords', () => {
      const result = validatePasswordMatch('MyStr0ng!Pass', 'DifferentPass1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('do not match');
    });

    it('should reject invalid password', () => {
      const result = validatePasswordMatch('weak', 'weak');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should validate strong matching passwords', () => {
      const result = validatePasswordMatch('SecureP@ssw0rd', 'SecureP@ssw0rd');
      expect(result.isValid).toBe(true);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return weak label', () => {
      const label = getPasswordStrengthLabel('weak');
      expect(label.label).toBe('Weak');
      expect(label.color).toContain('red');
    });

    it('should return medium label', () => {
      const label = getPasswordStrengthLabel('medium');
      expect(label.label).toBe('Medium');
      expect(label.color).toContain('yellow');
    });

    it('should return strong label', () => {
      const label = getPasswordStrengthLabel('strong');
      expect(label.label).toBe('Strong');
      expect(label.color).toContain('green');
    });

    it('should have descriptions', () => {
      const weak = getPasswordStrengthLabel('weak');
      const medium = getPasswordStrengthLabel('medium');
      const strong = getPasswordStrengthLabel('strong');

      expect(weak.description).toBeDefined();
      expect(medium.description).toBeDefined();
      expect(strong.description).toBeDefined();
    });
  });

  describe('Default requirements', () => {
    it('should require 8 characters minimum', () => {
      expect(DEFAULT_PASSWORD_REQUIREMENTS.minLength).toBe(8);
    });

    it('should require uppercase letters', () => {
      expect(DEFAULT_PASSWORD_REQUIREMENTS.requireUppercase).toBe(true);
    });

    it('should require lowercase letters', () => {
      expect(DEFAULT_PASSWORD_REQUIREMENTS.requireLowercase).toBe(true);
    });

    it('should require numbers', () => {
      expect(DEFAULT_PASSWORD_REQUIREMENTS.requireNumbers).toBe(true);
    });

    it('should require special characters', () => {
      expect(DEFAULT_PASSWORD_REQUIREMENTS.requireSpecialChars).toBe(true);
    });
  });

  describe('Real-world password examples', () => {
    it('should accept valid password examples', () => {
      const validPasswords = [
        'MySecureP@ss123',
        'C0mpl3x!Password',
        'Str0ng$ecurePass',
        'P@ssw0rd!Secure',
      ];

      validPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject common weak passwords', () => {
      const weakPasswords = ['password', '12345678', 'qwerty123', 'abcdefgh'];

      weakPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
      });
    });
  });
});
