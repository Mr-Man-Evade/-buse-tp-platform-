/**
 * Document Service - Document management API calls
 */

import apiClient from './api';
import { DOCUMENT_ENDPOINTS } from '../constants';

/**
 * Document service methods
 */
export const documentService = {
  /**
   * Upload document
   */
  upload: async (formData) => {
    const response = await apiClient.post(DOCUMENT_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get my documents (student)
   */
  getMyDocuments: async (params = {}) => {
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.MY_DOCUMENTS, { params });
    return response.data;
  },

  /**
   * Get all documents
   */
  getAllDocuments: async (params = {}) => {
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.ALL_DOCUMENTS, { params });
    return response.data;
  },

  /**
   * Get document by ID
   */
  getDocument: async (documentId) => {
    const response = await apiClient.get(`${DOCUMENT_ENDPOINTS.GET_DOCUMENT}/${documentId}`);
    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (documentId) => {
    const response = await apiClient.delete(`${DOCUMENT_ENDPOINTS.DELETE_DOCUMENT}/${documentId}`);
    return response.data;
  },

  /**
   * Update document
   */
  updateDocument: async (documentId, updates) => {
    const response = await apiClient.put(`${DOCUMENT_ENDPOINTS.GET_DOCUMENT}/${documentId}`, updates);
    return response.data;
  },

  /**
   * Download document
   */
  downloadDocument: async (documentId) => {
    const response = await apiClient.get(
      `${DOCUMENT_ENDPOINTS.DOWNLOAD_DOCUMENT}/${documentId}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Get documents for student (mentor/supervisor)
   */
  getStudentDocuments: async (studentId, params = {}) => {
    const response = await apiClient.get(
      `${DOCUMENT_ENDPOINTS.STUDENT_DOCUMENTS}/${studentId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get document statistics
   */
  getStatistics: async () => {
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.STATISTICS);
    return response.data;
  },
};

export default documentService;
