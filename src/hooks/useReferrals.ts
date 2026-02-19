import { useQuery } from '@tanstack/react-query';
import { getReferralStats } from '../api/referralsApi';
import type { ReferralStats } from '../types/referral';

/**
 * Hook to fetch referral statistics and referral list
 */
export const useReferralStats = (userId: string) => {
  return useQuery<ReferralStats>({
    queryKey: ['referralStats', userId],
    queryFn: () => getReferralStats(userId),
    enabled: !!userId,
  });
};
