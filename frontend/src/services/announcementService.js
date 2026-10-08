/**
 * Announcement Service - Announcement API calls
 */

import apiClient from './api';
import { ANNOUNCEMENT_ENDPOINTS } from '../constants';

export const announcementService = {
  /**
   * Get announcements for current user
   */
  getAnnouncements: async (params = {}) => {
    const response = await apiClient.get(ANNOUNCEMENT_ENDPOINTS.GET, { params });
    return response.data;
  },

  /**
   * Get announcement by ID
   */
  getAnnouncement: async (announcementId) => {
    const response = await apiClient.get(
      `${ANNOUNCEMENT_ENDPOINTS.GET_ONE}/${announcementId}`
    );
    return response.data;
  },

  /**
   * Create announcement (coordinator/admin)
   */
  createAnnouncement: async (announcementData) => {
    const response = await apiClient.post(ANNOUNCEMENT_ENDPOINTS.CREATE, announcementData);
    return response.data;
  },

  /**
   * Update announcement
   */
  updateAnnouncement: async (announcementId, updates) => {
    const response = await apiClient.put(
      `${ANNOUNCEMENT_ENDPOINTS.UPDATE}/${announcementId}`,
      updates
    );
    return response.data;
  },

  /**
   * Delete announcement
   */
  deleteAnnouncement: async (announcementId) => {
    const response = await apiClient.delete(
      `${ANNOUNCEMENT_ENDPOINTS.DELETE}/${announcementId}`
    );
    return response.data;
  },

  /**
   * Mark announcement as read
   */
  markAsRead: async (announcementId) => {
    const response = await apiClient.post(
      `${ANNOUNCEMENT_ENDPOINTS.MARK_READ}/${announcementId}`
    );
    return response.data;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get(ANNOUNCEMENT_ENDPOINTS.UNREAD_COUNT);
    return response.data;
  },
};

export default announcementService;
