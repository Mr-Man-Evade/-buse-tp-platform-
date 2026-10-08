/**
 * useApi Hook - Wrapper for React Query with auth and error handling
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from './useAuth';
import { getToken } from '../utils/storage';
import { parseApiError, getUserErrorMessage } from '../utils/errors';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants';

/**
 * Create axios instance with auth headers
 */
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Add token to requests
  client.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle responses
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const parsed = parseApiError(error);
      if (parsed.statusCode === 401) {
        // Unauthorized - clear auth and redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

/**
 * Fetch data using React Query
 */
export const useApiQuery = (
  key,
  endpoint,
  options = {}
) => {
  return useQuery(
    [key],
    async () => {
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      ...options,
    }
  );
};

/**
 * Execute mutation (POST, PUT, DELETE)
 */
export const useApiMutation = (
  endpoint,
  method = 'POST',
  options = {}
) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation(
    async (data) => {
      const response = await apiClient({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    },
    {
      onSuccess: (data, variables, context) => {
        // Invalidate related queries if specified
        if (options.invalidateQueries) {
          options.invalidateQueries.forEach((key) => {
            queryClient.invalidateQueries([key]);
          });
        }

        // Show success toast if configured
        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        // Call custom success handler
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        const errorMessage = getUserErrorMessage(error);

        // Show error toast
        toast.error(errorMessage);

        // Handle 401 - logout user
        if (error.response?.status === 401) {
          logout();
        }

        // Call custom error handler
        if (options.onError) {
          options.onError(error);
        }
      },
      retry: 1,
      ...options,
    }
  );
};

/**
 * Custom hook for GET requests
 */
export const useGet = (key, endpoint, options = {}) => {
  return useApiQuery(key, endpoint, options);
};

/**
 * Custom hook for POST requests
 */
export const usePost = (endpoint, options = {}) => {
  return useApiMutation(endpoint, 'POST', options);
};

/**
 * Custom hook for PUT requests
 */
export const usePut = (endpoint, options = {}) => {
  return useApiMutation(endpoint, 'PUT', options);
};

/**
 * Custom hook for DELETE requests
 */
export const useDelete = (endpoint, options = {}) => {
  return useApiMutation(endpoint, 'DELETE', options);
};

export default {
  useApiQuery,
  useApiMutation,
  useGet,
  usePost,
  usePut,
  useDelete,
};
