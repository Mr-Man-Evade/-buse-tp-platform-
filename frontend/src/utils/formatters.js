/**
 * Formatting Utilities - Date, time, file size, etc.
 */

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    case 'time':
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case 'datetime':
      return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    case 'iso':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString('en-US');
  }
};

/**
 * Format file size to readable format
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format time ago (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const seconds = Math.floor((new Date() - d) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return interval + ' years ago';
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + ' months ago';
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + ' days ago';
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + ' hours ago';
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals) + '%';
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get file name from path
 */
export const getFileName = (filePath) => {
  if (!filePath) return '';
  return filePath.split('/').pop();
};

/**
 * Get file extension
 */
export const getFileExtension = (fileName) => {
  if (!fileName) return '';
  return fileName.split('.').pop().toLowerCase();
};

/**
 * Format duration (HH:MM:SS)
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
