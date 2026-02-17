import axiosClient from './axiosClient';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

/**
 * Request password reset email
 */
export const requestPasswordReset = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const response = await axiosClient.post<ForgotPasswordResponse>(
    '/user/reset-password',
    payload
  );
  return response.data;
};
