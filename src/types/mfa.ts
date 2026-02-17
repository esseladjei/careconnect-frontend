export interface MFAStateSettings {
  isMFAEnabled: boolean;
  mfaMethods: MFAMethod[];
  primaryMethod?: 'email' | 'totp';
}

export interface MFAMethod {
  type: 'email' | 'totp';
  isVerified: boolean;
  enrolledAt?: Date;
  lastUsedAt?: Date;
}

export type MFAEnrollmentType = 'email' | 'totp';

export interface MFAEnrollmentResponse {
  success: boolean;
  qrCode?: string; // For TOTP
  secret?: string; // For TOTP
  message: string;
}

export interface MFAVerificationRequest {
  code: string;
  method: 'email' | 'totp';
  userId?: string;
}

export interface MFAVerificationResponse {
  success: boolean;
  message: string;
  token?: string; // New token if verification was successful
}

export interface MFADisableRequest {
  method: MFAEnrollmentType;
  password: string; // Require password to disable MFA
}
