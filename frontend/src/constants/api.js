/**
 * API Configuration & Endpoints
 * All API endpoints centralized here - runs locally on port 5000
 */

// Local backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  TOKEN_REGISTER: '/auth/token-register',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  REFRESH_TOKEN: '/auth/refresh-token',
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id) => `/users/profile/${id}`,
  GET_BY_ROLE: (role) => `/users/role/${role}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  TOGGLE_ACTIVE: (id) => `/users/${id}/toggle-active`,
  RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
  UPLOAD_PROFILE_PICTURE: '/users/profile-picture',
};

// Document endpoints
export const DOCUMENT_ENDPOINTS = {
  UPLOAD: '/documents/upload',
  GET_ALL: '/documents',
  GET_MY_DOCUMENTS: '/documents/my-documents',
  GET_BY_ID: (id) => `/documents/${id}`,
  DELETE: (id) => `/documents/${id}`,
  UPDATE: (id) => `/documents/${id}`,
};

// Assignment endpoints
export const ASSIGNMENT_ENDPOINTS = {
  CREATE: '/assignments',
  GET_ALL: '/assignments',
  BULK_CREATE: '/assignments/bulk',
  GET_MY_STUDENTS: '/assignments/my-students',
  GET_MY_ASSIGNMENT: '/assignments/my-assignment',
  GET_UNASSIGNED_STUDENTS: '/assignments/unassigned-students',
  DELETE: (id) => `/assignments/${id}`,
};

// Feedback endpoints
export const FEEDBACK_ENDPOINTS = {
  CREATE: '/feedback',
  GET_BY_DOCUMENT: (docId) => `/feedback/document/${docId}`,
  GET_BY_ID: (id) => `/feedback/${id}`,
  UPDATE: (id) => `/feedback/${id}`,
  DELETE: (id) => `/feedback/${id}`,
};

// Announcement endpoints
export const ANNOUNCEMENT_ENDPOINTS = {
  CREATE: '/announcements',
  GET_ALL: '/announcements',
  GET_UNREAD_COUNT: '/announcements/unread-count',
  MARK_AS_READ: (id) => `/announcements/${id}/read`,
  DELETE: (id) => `/announcements/${id}`,
};

// Message endpoints
export const MESSAGE_ENDPOINTS = {
  SEND: '/messages',
  GET_ALL: '/messages',
  GET_CONVERSATION: (userId) => `/messages/conversation/${userId}`,
  GET_BY_ID: (id) => `/messages/${id}`,
  DELETE: (id) => `/messages/${id}`,
};

// Final marks endpoints
export const FINAL_MARKS_ENDPOINTS = {
  CREATE: '/final-marks',
  GET_ALL: '/final-marks',
  GET_BY_STUDENT: (studentId) => `/final-marks/student/${studentId}`,
  UPDATE: (id) => `/final-marks/${id}`,
  DELETE: (id) => `/final-marks/${id}`,
};

// Assessment forms endpoints
export const ASSESSMENT_FORMS_ENDPOINTS = {
  CREATE: '/assessment-forms',
  GET_ALL: '/assessment-forms',
  GET_BY_ID: (id) => `/assessment-forms/${id}`,
  GET_BY_STUDENT: (studentId) => `/assessment-forms/student/${studentId}`,
  UPDATE: (id) => `/assessment-forms/${id}`,
  DELETE: (id) => `/assessment-forms/${id}`,
};

// Reports endpoints
export const REPORTS_ENDPOINTS = {
  GET_SUMMARY: '/reports/summary',
  GET_STUDENT_PROGRESS: (studentId) => `/reports/student/${studentId}`,
  GET_GRADEBOOK: '/reports/gradebook',
};

// Tokens endpoints
export const TOKENS_ENDPOINTS = {
  GENERATE: '/tokens/generate',
  VALIDATE: (token) => `/tokens/validate/${token}`,
  LIST: '/tokens',
  REVOKE: (id) => `/tokens/${id}`,
};

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  GET_ALL: '/settings',
  UPDATE: (key) => `/settings/${key}`,
};

// Health check
export const HEALTH_CHECK_ENDPOINT = '/health';

// Complete endpoint map for easy reference
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  DOCUMENTS: DOCUMENT_ENDPOINTS,
  ASSIGNMENTS: ASSIGNMENT_ENDPOINTS,
  FEEDBACK: FEEDBACK_ENDPOINTS,
  ANNOUNCEMENTS: ANNOUNCEMENT_ENDPOINTS,
  MESSAGES: MESSAGE_ENDPOINTS,
  FINAL_MARKS: FINAL_MARKS_ENDPOINTS,
  ASSESSMENT_FORMS: ASSESSMENT_FORMS_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  TOKENS: TOKENS_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
};
