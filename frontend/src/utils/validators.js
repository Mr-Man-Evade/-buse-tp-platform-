/**
 * Validation Utilities - Common validation functions
 */

import { PATTERNS } from '../constants';

/**
 * Validate email
 */
export const validateEmail = (email) => {
  return PATTERNS.EMAIL.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return PATTERNS.PASSWORD.test(password);
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  return PATTERNS.PHONE.test(phone);
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  return PATTERNS.URL.test(url);
};

/**
 * Validate required field
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate min length
 */
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return value.toString().length >= minLength;
};

/**
 * Validate max length
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.toString().length <= maxLength;
};

/**
 * Validate min value
 */
export const validateMin = (value, min) => {
  return Number(value) >= min;
};

/**
 * Validate max value
 */
export const validateMax = (value, max) => {
  return Number(value) <= max;
};

/**
 * Validate range
 */
export const validateRange = (value, min, max) => {
  const num = Number(value);
  return num >= min && num <= max;
};

/**
 * Validate match between two values
 */
export const validateMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file
 */
export const validateFile = (file, maxSizeMB = 10, allowedTypes = []) => {
  if (!file) return { valid: false, error: 'File is required' };
  if (!validateFileSize(file, maxSizeMB)) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
    return { valid: false, error: 'File type not allowed' };
  }
  return { valid: true };
};

/**
 * Validate date
 */
export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

/**
 * Validate credit card
 */
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  // Alphanumeric and underscore, 3-20 chars
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

/**
 * Validate strong password
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength < 2) return 'weak';
  if (strength < 4) return 'fair';
  if (strength < 6) return 'good';
  return 'strong';
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate and normalize email
 */
export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

/**
 * Validate is array with items
 */
export const validateHasItems = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Validate object is not empty
 */
export const validateObjectNotEmpty = (obj) => {
  return typeof obj === 'object' && Object.keys(obj).length > 0;
};
