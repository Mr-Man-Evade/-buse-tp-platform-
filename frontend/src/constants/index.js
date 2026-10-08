/**
 * Constants - Centralized exports for all constant definitions
 */

export * from './roles';
export * from './statuses';
export * from './routes';
export * from './colors';
export * from './api';

// Common constants
export const APP_NAME = 'BUSE Teaching Practice';
export const APP_VERSION = '1.0.0';

export const FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZES: [10, 25, 50, 100],
};

export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_TIMEZONE = 'UTC';

// Toast notification durations (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, // Min 8 chars, upper, lower, number
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
};
