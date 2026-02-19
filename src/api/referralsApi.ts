import axiosClient from './axiosClient';
import type { ReferralStats } from '../types/referral';

const BASE_URL = '/referrals';

/**
 * Get referral statistics/code and list for the current user
 */
export const getReferralStats = async (
  userId: string
): Promise<ReferralStats> => {
  const response = await axiosClient.get<ReferralStats>(
    `${BASE_URL}/${userId}`
  );
  return response.data;
};

/**
 * Track when someone clicks on a referral link (optional analytics)
 */
export const trackReferralClick = async (
  referralCode: string
): Promise<void> => {
  await axiosClient.post(`${BASE_URL}/track-click`, { referralCode });
};

/**
 * Validate a referral code during registration
 */
export const validateReferralCode = async (
  referralCode: string
): Promise<{ valid: boolean; referrerName?: string }> => {
  const response = await axiosClient.get(
    `${BASE_URL}/validate/${referralCode}`
  );
  return response.data;
};
