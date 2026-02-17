import axiosClient from './axiosClient';

export interface ResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

/**
 * Reset user password
 */
export const resetPassword = async (
  role: string,
  userId: string,
  timestamp: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const response = await axiosClient.post<ResetPasswordResponse>(
    `user/password-reset/${role}/${userId}/${timestamp}`,
    payload
  );
  return response.data;
};
