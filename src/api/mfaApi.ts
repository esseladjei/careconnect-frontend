import axiosClient from './axiosClient';
import type {
  MFADisableRequest,
  MFAEnrollmentType,
  MFAVerificationRequest,
} from '../types/mfa';

/**
 * Fetch current MFA settings for the user
 */
export const fetchMFASettings = async (userId: string): Promise<any> => {
  const response = await axiosClient.get(`/mfa/settings/${userId}`);
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};

/**
 * Enable MFA for the user
 */
export const enableMFA = async (userId: string): Promise<void> => {
  await axiosClient.post(`/mfa/enable/${userId}`);
};

/**
 * Disable MFA for the user
 */
export const disableMFA = async (
  userId: string,
  data: MFADisableRequest
): Promise<void> => {
  await axiosClient.post(`/mfa/disable/${userId}`, data);
};

/**
 * Enroll a new MFA method (email or TOTP) // Later SMS might be added
 */
export const enrollMFAMethod = async (
  userId: string,
  userEmail: string,
  method: MFAEnrollmentType
): Promise<any> => {
  const response = await axiosClient.post(`/mfa/enroll/${userId}`, {
    method,
    email: userEmail,
  });
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};

/**
 * Verify MFA method enrollment (confirm the code)
 */
export const verifyMFAEnrollment = async (
  userId: string,
  data: MFAVerificationRequest
): Promise<any> => {
  const response = await axiosClient.post(
    `/mfa/verify-enrollment/${userId}`,
    data
  );
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};

/**
 * Verify MFA code during login or sensitive operations
 */
export const verifyMFACode = async (
  data: MFAVerificationRequest
): Promise<any> => {
  const response = await axiosClient.post(`/mfa/verify`, data);
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};

/**
 * Set primary MFA method
 */
export const setPrimaryMFAMethod = async (
  userId: string,
  method: MFAEnrollmentType
): Promise<void> => {
  await axiosClient.post(`/mfa/set-primary/${userId}`, { method });
};

/**
 * Remove a specific MFA method
 */
export const removeMFAMethod = async (
  userId: string,
  method: MFAEnrollmentType
): Promise<void> => {
  await axiosClient.delete(`/mfa/method/${userId}/${method}`);
};

/**
 * Send MFA code during login or sensitive operation (triggers email or prepares TOTP)
 */
export const sendMFACode = async (
  userId: string,
  method: MFAEnrollmentType
): Promise<any> => {
  const response = await axiosClient.post(`/mfa/send-code`, {
    userId,
    method,
  });
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};
