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

const clearStoredAuth = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('providerId');
  localStorage.removeItem('patientId');
  localStorage.removeItem('role');
};

const refreshSession = async () => {
  await refreshClient.post('/auth/refresh');
};

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
