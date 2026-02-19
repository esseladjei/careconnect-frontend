import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

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
};;

// Response interceptor to handle auth expiration
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const data = error.response?.data as { code?: string };
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

export default axiosClient;
