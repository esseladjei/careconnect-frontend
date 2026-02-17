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
  const response = await axiosClient.get(`/mfa/settings/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};

/**
 * Enable MFA for the user
 */
export const enableMFA = async (userId: string): Promise<void> => {
  await axiosClient.post(
    `/mfa/enable/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

/**
 * Disable MFA for the user
 */
export const disableMFA = async (
  userId: string,
  data: MFADisableRequest
): Promise<void> => {
  await axiosClient.post(`/mfa/disable/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

/**
 * Enroll a new MFA method (email or TOTP) // Later SMS might be added
 */
export const enrollMFAMethod = async (
  userId: string,
  userEmail: string,
  method: MFAEnrollmentType
): Promise<any> => {
  const response = await axiosClient.post(
    `/mfa/enroll/${userId}`,
    { method, email: userEmail },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
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
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
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
  await axiosClient.post(
    `/mfa/set-primary/${userId}`,
    { method },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

/**
 * Remove a specific MFA method
 */
export const removeMFAMethod = async (
  userId: string,
  method: MFAEnrollmentType
): Promise<void> => {
  await axiosClient.delete(`/mfa/method/${userId}/${method}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

/**
 * Send MFA code during login (triggers email or prepares TOTP)
 */
export const sendMFACodeForLogin = async (
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

/**
 * Verify MFA code during login to get authentication token
 */
/*
export const verifyMFACodeForLogin = async (
  userId: string,
  code: string,
  method: MFAEnrollmentType
): Promise<any> => {
  const response = await axiosClient.post(`/mfa/verify`, {
    userId,
    code,
    method,
  });
  // Handle both direct data and wrapped response format
  return response.data.data || response.data;
};
*/
