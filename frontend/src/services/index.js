/**
 * Services - Central export point for all API services
 */

export { default as apiClient } from './api';
export { authService } from './authService';
export { documentService } from './documentService';
export { feedbackService } from './feedbackService';
export { assignmentService } from './assignmentService';
export { announcementService } from './announcementService';

/**
 * All services combined
 */
export const services = {
  auth: require('./authService').authService,
  document: require('./documentService').documentService,
  feedback: require('./feedbackService').feedbackService,
  assignment: require('./assignmentService').assignmentService,
  announcement: require('./announcementService').announcementService,
};

export default services;
