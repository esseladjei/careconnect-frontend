import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import reviewsApi from '../api/reviewsApi';
import type {
  IProviderRatingSummary,
  SubmitFlagPayload,
  SubmitReviewPayload,
} from '../types/reviews';
import toast from 'react-hot-toast';

export const reviewQueryKeys = {
  all: ['reviews'] as const,
  rating: (providerId: string) =>
    [...reviewQueryKeys.all, 'rating', providerId] as const,
  providerReviews: (providerId: string, page: number, limit: number) =>
    [...reviewQueryKeys.all, 'provider', providerId, page, limit] as const,
  flags: (page: number, limit: number, resolved?: boolean) =>
    [...reviewQueryKeys.all, 'flags', page, limit, resolved] as const,
};

export const useProviderRating = (
  providerId?: string
): UseQueryResult<IProviderRatingSummary, Error> => {
  return useQuery({
    queryKey: providerId ? reviewQueryKeys.rating(providerId) : [],
    queryFn: () => reviewsApi.getProviderRating(providerId as string),
    enabled: Boolean(providerId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitReview = (): UseMutationResult<
  { message: string },
  Error,
  SubmitReviewPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) =>
      reviewsApi.submitReview(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      toast.success('Review submitted successfully.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to submit review.');
    },
  });
};

export const useSubmitFlag = (): UseMutationResult<
  { message: string },
  Error,
  SubmitFlagPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitFlagPayload) => reviewsApi.submitFlag(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      toast.success('Report submitted. Admin will review this case.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to submit report.');
    },
  });
};

export const useAdminProviderReviews = (
  providerId: string,
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: reviewQueryKeys.providerReviews(providerId, page, limit),
    queryFn: () => reviewsApi.getProviderReviews(providerId, page, limit),
    enabled: Boolean(providerId),
  });
};

export const useAdminFlags = (page = 1, limit = 10, resolved?: boolean) => {
  return useQuery({
    queryKey: reviewQueryKeys.flags(page, limit, resolved),
    queryFn: () => reviewsApi.getAllFlags(page, limit, resolved),
  });
};

export const useResolveFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      flagId,
      adminNotes,
    }: {
      flagId: string;
      adminNotes?: string;
    }) => reviewsApi.resolveFlag(flagId, adminNotes),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      toast.success('Flag resolved.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to resolve flag.');
    },
  });
};
