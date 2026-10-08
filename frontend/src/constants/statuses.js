/**
 * Document & Application Status Constants
 */

export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVIEWED: 'reviewed',
};

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.PENDING]: 'Pending Review',
  [DOCUMENT_STATUS.APPROVED]: 'Approved',
  [DOCUMENT_STATUS.REJECTED]: 'Rejected',
  [DOCUMENT_STATUS.REVIEWED]: 'Reviewed',
};

export const DOCUMENT_CATEGORIES = {
  RETURN_SLIP: 'return-slip',
  SCHEME_OF_WORK: 'scheme-of-work',
  DAILY_LESSON_PLAN: 'daily-lesson-plan',
  EVIDENCE: 'evidence',
  REFLECTION: 'reflection',
  GENERAL: 'general',
};

export const DOCUMENT_CATEGORY_LABELS = {
  [DOCUMENT_CATEGORIES.RETURN_SLIP]: 'Return Slip',
  [DOCUMENT_CATEGORIES.SCHEME_OF_WORK]: 'Scheme of Work',
  [DOCUMENT_CATEGORIES.DAILY_LESSON_PLAN]: 'Daily Lesson Plan (DLP)',
  [DOCUMENT_CATEGORIES.EVIDENCE]: 'Evidence',
  [DOCUMENT_CATEGORIES.REFLECTION]: 'Reflection',
  [DOCUMENT_CATEGORIES.GENERAL]: 'General',
};

export const MESSAGE_STATUS = {
  UNREAD: 0,
  READ: 1,
};

export const ANNOUNCEMENT_TARGET = {
  ALL: 'all',
  STUDENT: 'student',
  MENTOR: 'mentor',
  SUPERVISOR: 'supervisor',
  COORDINATOR: 'coordinator',
};

export const REGISTRATION_TOKEN_STATUS = {
  ACTIVE: false, // used = false
  USED: true,    // used = true
};
