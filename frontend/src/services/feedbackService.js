/**
 * Feedback Service - Feedback API calls
 */

import apiClient from './api';
import { FEEDBACK_ENDPOINTS } from '../constants';

export const feedbackService = {
  /**
   * Submit feedback for document
   */
  submitFeedback: async (documentId, feedbackData) => {
    const response = await apiClient.post(FEEDBACK_ENDPOINTS.SUBMIT, {
      documentId,
      ...feedbackData,
    });
    return response.data;
  },

  /**
   * Get feedback for document
   */
  getDocumentFeedback: async (documentId) => {
    const response = await apiClient.get(
      `${FEEDBACK_ENDPOINTS.GET_BY_DOCUMENT}/${documentId}`
    );
    return response.data;
  },

  /**
   * Get my feedback (student)
   */
  getMyFeedback: async () => {
    const response = await apiClient.get(FEEDBACK_ENDPOINTS.MY_FEEDBACK);
    return response.data;
  },

  /**
   * Update feedback
   */
  updateFeedback: async (feedbackId, updates) => {
    const response = await apiClient.put(
      `${FEEDBACK_ENDPOINTS.UPDATE}/${feedbackId}`,
      updates
    );
    return response.data;
  },

  /**
   * Delete feedback
   */
  deleteFeedback: async (feedbackId) => {
    const response = await apiClient.delete(
      `${FEEDBACK_ENDPOINTS.DELETE}/${feedbackId}`
    );
    return response.data;
  },
};

export default feedbackService;
