/**
 * Assignment Service - Assignment API calls
 */

import apiClient from './api';
import { ASSIGNMENT_ENDPOINTS } from '../constants';

export const assignmentService = {
  /**
   * Get my assignment (student)
   */
  getMyAssignment: async () => {
    const response = await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_MY_ASSIGNMENT);
    return response.data;
  },

  /**
   * Get assigned students (mentor/supervisor)
   */
  getMyStudents: async () => {
    const response = await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_MY_STUDENTS);
    return response.data;
  },

  /**
   * Create assignment
   */
  createAssignment: async (assignmentData) => {
    const response = await apiClient.post(ASSIGNMENT_ENDPOINTS.CREATE, assignmentData);
    return response.data;
  },

  /**
   * Bulk create assignments
   */
  bulkCreate: async (assignments) => {
    const response = await apiClient.post(ASSIGNMENT_ENDPOINTS.BULK_CREATE, {
      assignments,
    });
    return response.data;
  },

  /**
   * Get all assignments
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Update assignment
   */
  updateAssignment: async (assignmentId, updates) => {
    const response = await apiClient.put(
      `${ASSIGNMENT_ENDPOINTS.UPDATE}/${assignmentId}`,
      updates
    );
    return response.data;
  },

  /**
   * Delete assignment
   */
  deleteAssignment: async (assignmentId) => {
    const response = await apiClient.delete(
      `${ASSIGNMENT_ENDPOINTS.DELETE}/${assignmentId}`
    );
    return response.data;
  },
};

export default assignmentService;
