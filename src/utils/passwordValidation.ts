/**
 * Password Validation Utility for CareConnect
 * Provides comprehensive password validation with strength checking
 */

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
  message: string;
  score: number; // 0-100
}

/**
 * Password requirements configuration
 */
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars: string;
}

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Validates a password based on requirements
 */
export const validatePassword = (
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Check if password is provided
  if (!password) {
    return {
      isValid: false,
      strength: 'weak',
      errors: ['Password is required'],
      message: 'Password is required',
      score: 0,
    };
  }

  const trimmed = password.trim();

  if (!trimmed) {
    return {
      isValid: false,
      strength: 'weak',
      errors: ['Password cannot be empty'],
      message: 'Password cannot be empty',
      score: 0,
    };
  }

  // Length check
  if (trimmed.length < requirements.minLength) {
    errors.push(
      `Password must be at least ${requirements.minLength} characters long`
    );
    score += 10;
  } else if (trimmed.length < 12) {
    score += 20;
  } else if (trimmed.length < 16) {
    score += 30;
  } else {
    score += 40;
  }

  // Uppercase check
  if (requirements.requireUppercase) {
    if (!/[A-Z]/.test(trimmed)) {
      errors.push('Password must contain at least one uppercase letter (A-Z)');
    } else {
      score += 15;
    }
  }

  // Lowercase check
  if (requirements.requireLowercase) {
    if (!/[a-z]/.test(trimmed)) {
      errors.push('Password must contain at least one lowercase letter (a-z)');
    } else {
      score += 15;
    }
  }

  // Numbers check
  if (requirements.requireNumbers) {
    if (!/[0-9]/.test(trimmed)) {
      errors.push('Password must contain at least one number (0-9)');
    } else {
      score += 15;
    }
  }

  // Special characters check
  if (requirements.requireSpecialChars) {
    const specialCharsRegex = new RegExp(
      `[${requirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
    );
    if (!specialCharsRegex.test(trimmed)) {
      errors.push(
        `Password must contain at least one special character (!@#$%^&*)`
      );
    } else {
      score += 15;
    }
  }

  // Bonus points for mixed types
  const hasUppercase = /[A-Z]/.test(trimmed);
  const hasLowercase = /[a-z]/.test(trimmed);
  const hasNumbers = /[0-9]/.test(trimmed);
  const specialCharsRegex = new RegExp(
    `[${requirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
  );
  const hasSpecial = specialCharsRegex.test(trimmed);

  const typeCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(
    Boolean
  ).length;
  if (typeCount === 4) {
    score += 10;
  }

  // Check for common patterns (weak patterns)
  const weakPatterns = [/^123/, /^abc/i, /^password/i, /^\d{8,}/, /(.)\\1{2,}/];

  let hasWeakPattern = false;
  for (const pattern of weakPatterns) {
    if (pattern.test(trimmed)) {
      errors.push('Password contains common or predictable patterns');
      hasWeakPattern = true;
      score -= 20;
      break;
    }
  }

  // Check for sequential characters
  if (/(.)(.)(?=\2\1)/.test(trimmed)) {
    errors.push('Password contains sequential or repeated characters');
    score -= 10;
  }

  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 70 && errors.length === 0) {
    strength = 'strong';
  } else if (score >= 50 && errors.length <= 1) {
    strength = 'medium';
  }

  const isValid = errors.length === 0 && strength !== 'weak';

  return {
    isValid,
    strength,
    errors,
    message: isValid
      ? `Strong password (Score: ${score}/100)`
      : errors[0] || 'Invalid password',
    score,
  };
};

/**
 * Check if password matches confirmation password
 */
export const passwordsMatch = (
  password: string,
  confirmation: string
): boolean => {
  return password === confirmation;
};

/**
 * Get password strength label with description
 */
export const getPasswordStrengthLabel = (
  strength: 'weak' | 'medium' | 'strong'
): { label: string; color: string; description: string } => {
  switch (strength) {
    case 'weak':
      return {
        label: 'Weak',
        color: 'text-red-600',
        description: 'Your password needs to be stronger',
      };
    case 'medium':
      return {
        label: 'Medium',
        color: 'text-yellow-600',
        description: 'Your password is acceptable but could be stronger',
      };
    case 'strong':
      return {
        label: 'Strong',
        color: 'text-green-600',
        description: 'Your password is strong and secure',
      };
  }
};

/**
 * Get password strength bar color
 */
export const getPasswordStrengthColor = (
  strength: 'weak' | 'medium' | 'strong'
): string => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
  }
};

/**
 * Get password strength bar width percentage
 */
export const getPasswordStrengthWidth = (
  strength: 'weak' | 'medium' | 'strong'
): string => {
  switch (strength) {
    case 'weak':
      return 'w-1/3';
    case 'medium':
      return 'w-2/3';
    case 'strong':
      return 'w-full';
  }
};

/**
 * Validates both password and confirmation match
 */
export const validatePasswordMatch = (
  password: string,
  confirmation: string,
  requirements?: PasswordRequirements
): { isValid: boolean; error?: string } => {
  // First validate password
  const passwordValidation = validatePassword(password, requirements);
  if (!passwordValidation.isValid) {
    return {
      isValid: false,
      error: passwordValidation.message,
    };
  }

  // Then check if passwords match
  if (!passwordsMatch(password, confirmation)) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Get password strength requirements checklist
 */
export const getPasswordChecklist = (
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): Array<{
  requirement: string;
  met: boolean;
  icon: string;
}> => {
  return [
    {
      requirement: `At least ${requirements.minLength} characters`,
      met: password.length >= requirements.minLength,
      icon: password.length >= requirements.minLength ? '✓' : '○',
    },
    {
      requirement: 'At least one uppercase letter (A-Z)',
      met: requirements.requireUppercase ? /[A-Z]/.test(password) : true,
      icon: requirements.requireUppercase
        ? /[A-Z]/.test(password)
          ? '✓'
          : '○'
        : '✓',
    },
    {
      requirement: 'At least one lowercase letter (a-z)',
      met: requirements.requireLowercase ? /[a-z]/.test(password) : true,
      icon: requirements.requireLowercase
        ? /[a-z]/.test(password)
          ? '✓'
          : '○'
        : '✓',
    },
    {
      requirement: 'At least one number (0-9)',
      met: requirements.requireNumbers ? /[0-9]/.test(password) : true,
      icon: requirements.requireNumbers
        ? /[0-9]/.test(password)
          ? '✓'
          : '○'
        : '✓',
    },
    {
      requirement: 'At least one special character (!@#$%^&*)',
      met: requirements.requireSpecialChars
        ? new RegExp(
            `[${requirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
          ).test(password)
        : true,
      icon: requirements.requireSpecialChars
        ? new RegExp(
            `[${requirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
          ).test(password)
          ? '✓'
          : '○'
        : '✓',
    },
  ];
};

/**
 * Generate password strength percentage for visual display
 */
export const getPasswordStrengthPercentage = (
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): number => {
  const validation = validatePassword(password, requirements);
  return validation.score;
};
