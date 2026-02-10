import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5500/api',
});

// Request interceptor to add token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('providerId');
      localStorage.removeItem('patientId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
