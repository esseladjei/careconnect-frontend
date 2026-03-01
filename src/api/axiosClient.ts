import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// Helper to get user's timezone
const getTimezone = (): string => {
  // Try to get from localStorage first
  const stored = localStorage.getItem('userTimezone');
  if (stored) return stored;

  // Otherwise detect automatically
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const axiosClient = axios.create({
  baseURL: 'http://localhost:5500/api',
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: 'http://localhost:5500/api',
  withCredentials: true,
});

// Token refresh queue management
let refreshPromise: Promise<void> | null = null;

const clearStoredAuth = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('providerId');
  localStorage.removeItem('patientId');
  localStorage.removeItem('role');
};

/**
 * Request interceptor to add timezone header to all API requests
 * This ensures the backend knows which timezone to use for time calculations
 */
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const timezone = getTimezone();
  config.headers['X-Timezone'] = timezone;
  return config;
});

/**
 * Refresh session with queuing to prevent concurrent refresh requests
 * Multiple failed requests will wait for the first refresh to complete
 */
const refreshSession = async () => {
  // If a refresh is already in progress, wait for it instead of making a new request
  if (refreshPromise) {
    return refreshPromise;
  }

  // Create a new refresh promise and store it
  refreshPromise = refreshClient
    .post('/auth/refresh')
    .then(() => {
      refreshPromise = null;
    })
    .catch((error) => {
      refreshPromise = null;
      throw error;
    });

  return refreshPromise;
};

// Response interceptor to handle auth expiration
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const data = error.response?.data as { code?: string };
    const isAuthMeRequest =
      typeof originalRequest.url === 'string' &&
      originalRequest.url.includes('/auth/me');

    // ✅ FIX: Don't redirect to login for /auth/me 401 errors
    // These are expected when session is invalid
    if (isAuthMeRequest && error.response?.status === 401) {
      console.log('Session verification failed - user not authenticated');
      // Just return the error, don't redirect
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      data?.code === 'TOKEN_EXPIRED' &&
      originalRequest
    ) {
      const isRefreshRequest =
        typeof originalRequest.url === 'string' &&
        originalRequest.url.includes('/auth/refresh');

      if (!originalRequest._retry && !isRefreshRequest) {
        originalRequest._retry = true;
        try {
          await refreshSession();
          return axiosClient(originalRequest);
        } catch (refreshError) {
          clearStoredAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      clearStoredAuth();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/**
 * Update the timezone used in API requests
 * Call this when user changes their timezone in settings
 */
export const setTimezone = (timezone: string): void => {
  localStorage.setItem('userTimezone', timezone);
};

export default axiosClient;
