import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePhoneValidation } from '../../src/hooks/usePhoneValidation';

describe('usePhoneValidation - Hook Tests', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePhoneValidation());

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.operator).toBeNull();
  });

  it('validates phone number correctly', () => {
    const { result } = renderHook(() => usePhoneValidation());

    act(() => {
      result.current.validate('0241234567');
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.operator).toBe('MTN');
  });

  it('sets error message for invalid phone', () => {
    const { result } = renderHook(() => usePhoneValidation());

    act(() => {
      result.current.validate('invalid');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it('clears validation state', () => {
    const { result } = renderHook(() => usePhoneValidation());

    act(() => {
      result.current.validate('0241234567');
    });

    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.clear();
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.operator).toBeNull();
  });

  it('converts to international format', () => {
    const { result } = renderHook(() => usePhoneValidation());

    const international = result.current.toInternational('0241234567');
    expect(international).toBe('+233241234567');
  });

  it('converts to Ghana format', () => {
    const { result } = renderHook(() => usePhoneValidation());

    const ghana = result.current.toGhana('+233241234567');
    expect(ghana).toBe('0241234567');
  });

  it('detects different operators', () => {
    const { result } = renderHook(() => usePhoneValidation());

    act(() => {
      result.current.validate('0241234567');
    });
    expect(result.current.operator).toBe('MTN');

    act(() => {
      result.current.validate('0501234567');
    });
    expect(result.current.operator).toBe('VODAFONE');

    act(() => {
      result.current.validate('0271234567');
    });
    expect(result.current.operator).toBe('AIRTELTIGO');
  });
});
