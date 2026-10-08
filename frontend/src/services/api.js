/**
 * API Service Layer - Core axios instance with interceptors
 */

import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';
import { API_BASE_URL } from '../constants';

/**
 * Create axios instance with base config
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - clear auth and redirect
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }

    // Handle 403 - unauthorized
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
