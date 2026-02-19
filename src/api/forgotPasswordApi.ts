import axiosClient from './axiosClient';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface MFARequirements {
  requiresMFA: boolean;
  mfaMethods: Array<{ type: 'email' | 'totp'; isVerified: boolean }>;
  primaryMethod: 'email' | 'totp';
  sessionToken?: string;
}

/**
 * Request password reset email
 */
export const requestPasswordReset = async (
  payload: ForgotPasswordPayload,
  mfaToken?: string
): Promise<ForgotPasswordResponse> => {
  const headers: Record<string, string> = {};

  // Add MFA token if provided
  if (mfaToken) {
    headers['x-mfa-token'] = mfaToken;
  }

  const response = await axiosClient.post<ForgotPasswordResponse>(
    '/user/reset-password',
    payload,
    { headers }
  );
  return response.data;
};
