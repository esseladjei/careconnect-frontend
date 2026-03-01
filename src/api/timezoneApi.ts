import axiosClient from './axiosClient';

/**
 * Update user's timezone preference
 * @param userId - The user's ID
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns Promise with the updated timezone data
 */
export const updateTimezone = async (
  userId: string,
  timezone: string
): Promise<{ timezone: string }> => {
  const response = await axiosClient.patch(`user/timezone/${userId}`, {
    timezone,
  });
  return response.data;
};

/**
 * Get user's timezone preference
 * @param userId - The user's ID
 * @returns Promise with the user's timezone
 */
export const getTimezone = async (
  userId: string
): Promise<{ timezone: string }> => {
  const response = await axiosClient.get(`user/timezone/${userId}`);
  return response.data;
};
