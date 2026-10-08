/**
 * Auth Service - Authentication API calls
 */

import apiClient from './api';
import { AUTH_ENDPOINTS } from '../constants';

/**
 * Authentication service methods
 */
export const authService = {
  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Register with token
   */
  tokenRegister: async (token, userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.TOKEN_REGISTER, {
      token,
      ...userData,
    });
    return response.data;
  },

  /**
   * Validate registration token
   */
  validateRegistrationToken: async (token) => {
    const response = await apiClient.get(`/tokens/validate/${token}`);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (updates) => {
    const response = await apiClient.put(AUTH_ENDPOINTS.PROFILE, updates);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post(`${AUTH_ENDPOINTS.FORGOT_PASSWORD}/reset`, {
      token,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
