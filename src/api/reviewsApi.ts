import axiosClient from './axiosClient';
import type {
  ProviderFlag,
  ProviderRatingSummary,
  Review,
  SubmitFlagPayload,
  SubmitReviewPayload,
} from '../types/reviews';

const BASE_URL = '/reviews';

export interface ProviderReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProviderFlagsResponse {
  flags: ProviderFlag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const reviewsApi = {
  submitReview: async (payload: SubmitReviewPayload) => {
    const response = await axiosClient.post(`${BASE_URL}`, payload);
    return response.data as { message: string; review: Review };
  },

  getProviderRating: async (providerId: string) => {
    const response = await axiosClient.get(
      `${BASE_URL}/provider/${providerId}/rating`
    );
    return response.data as ProviderRatingSummary;
  },

  submitFlag: async (payload: SubmitFlagPayload) => {
    const response = await axiosClient.post(`${BASE_URL}/flags`, payload);
    return response.data as { message: string; flag: ProviderFlag };
  },

  getProviderReviews: async (
    providerId: string,
    page = 1,
    limit = 10
  ): Promise<ProviderReviewsResponse> => {
    const response = await axiosClient.get(
      `${BASE_URL}/provider/${providerId}?page=${page}&limit=${limit}&includeComments=true`
    );
    return response.data as ProviderReviewsResponse;
  },

  getAllFlags: async (
    page = 1,
    limit = 10,
    resolved?: boolean
  ): Promise<ProviderFlagsResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (resolved !== undefined) {
      params.set('resolved', String(resolved));
    }
    const response = await axiosClient.get(
      `${BASE_URL}/flags?${params.toString()}`
    );
    return response.data as ProviderFlagsResponse;
  },

  resolveFlag: async (flagId: string, adminNotes?: string) => {
    const response = await axiosClient.patch(
      `${BASE_URL}/flags/${flagId}/resolve`,
      { adminNotes }
    );
    return response.data as { message: string; flag: ProviderFlag };
  },
};

export default reviewsApi;
