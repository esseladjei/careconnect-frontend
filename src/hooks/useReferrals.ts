import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateReferralCode, getReferralStats } from '../api/referralsApi';
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

/**
 * Hook to generate or retrieve referral code
 */
export const useGenerateReferralCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => generateReferralCode(userId),
    onSuccess: async (_, userId) => {
      // Invalidate and refetch referral stats
      await queryClient.invalidateQueries({
        queryKey: ['referralStats', userId],
      });
    },
  });
};
