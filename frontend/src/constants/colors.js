/**
 * Design Tokens - Colors, styles, and UI constants
 */

export const COLORS = {
  // Primary brand colors
  PRIMARY: '#002080',
  PRIMARY_DARK: '#001040',
  PRIMARY_LIGHT: '#003EFF',
  SECONDARY: '#87CEEB',

  // Status colors
  SUCCESS: '#10B981',
  SUCCESS_BG: '#D1FAE5',
  ERROR: '#EF4444',
  ERROR_BG: '#FEE2E2',
  WARNING: '#F59E0B',
  WARNING_BG: '#FEF3C7',
  INFO: '#3B82F6',
  INFO_BG: '#DBEAFE',

  // Neutral colors
  GRAY: '#6B7280',
  GRAY_LIGHT: '#F3F4F6',
  GRAY_DARK: '#111827',

  // Document status colors
  PENDING: '#FBBF24',
  APPROVED: '#34D399',
  REJECTED: '#F87171',
  REVIEWED: '#60A5FA',
};

export const STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700 border border-green-200',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border border-red-200',
  },
  reviewed: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
};

export const DOCUMENT_TYPE_COLORS = {
  'return-slip': 'bg-sky-100 text-sky-700',
  'scheme-of-work': 'bg-indigo-100 text-indigo-700',
  'daily-lesson-plan': 'bg-purple-100 text-purple-700',
  evidence: 'bg-teal-100 text-teal-700',
  reflection: 'bg-amber-100 text-amber-700',
  general: 'bg-gray-100 text-gray-600',
};

export const ROLE_COLORS = {
  student: 'bg-blue-100 text-blue-700',
  mentor: 'bg-green-100 text-green-700',
  supervisor: 'bg-purple-100 text-purple-700',
  coordinator: 'bg-orange-100 text-orange-700',
  admin: 'bg-red-100 text-red-700',
};

// UI component sizes
export const SIZES = {
  SIDEBAR_WIDTH: '240px',
  HEADER_HEIGHT: '64px',
  BUTTON_PADDING: 'px-4 py-2',
  BUTTON_SMALL: 'px-3 py-1 text-sm',
  BUTTON_LARGE: 'px-6 py-3 text-lg',
};

// Z-index scale
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOAST: 60,
  TOOLTIP: 70,
};

// Transition speeds
export const TRANSITIONS = {
  FAST: 'duration-150',
  NORMAL: 'duration-300',
  SLOW: 'duration-500',
};

export const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.pending;
export const getDocumentTypeColor = (type) => DOCUMENT_TYPE_COLORS[type] || DOCUMENT_TYPE_COLORS.general;
export const getRoleColor = (role) => ROLE_COLORS[role] || ROLE_COLORS.student;
