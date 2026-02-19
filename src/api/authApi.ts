import axiosClient from './axiosClient';

export const logout = () => axiosClient.post('/auth/logout');

export const logoutAll = () => axiosClient.post('/auth/logout-all');

/**
 * Verify the current session with the backend
 * Returns user session data if valid, throws if expired/invalid
 */
export const verifySession = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};