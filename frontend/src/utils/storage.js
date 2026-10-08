/**
 * Storage Utilities - Secure localStorage patterns
 */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  USER_ROLE: 'auth_role',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

/**
 * Get authentication token from localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (err) {
    console.error('Failed to get token:', err);
    return null;
  }
};

/**
 * Set authentication token
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  } catch (err) {
    console.error('Failed to set token:', err);
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error('Failed to get user:', err);
    return null;
  }
};

/**
 * Set user data
 */
export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (err) {
    console.error('Failed to set user:', err);
  }
};

/**
 * Get user role
 */
export const getUserRole = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  } catch (err) {
    console.error('Failed to get user role:', err);
    return null;
  }
};

/**
 * Set user role
 */
export const setUserRole = (role) => {
  try {
    if (role) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    }
  } catch (err) {
    console.error('Failed to set user role:', err);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getUser();
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  } catch (err) {
    console.error('Failed to clear auth:', err);
  }
};

/**
 * Get theme preference
 */
export const getTheme = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

/**
 * Set theme preference
 */
export const setTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Failed to set theme:', err);
  }
};

/**
 * Get language preference
 */
export const getLanguage = () => {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
};

/**
 * Set language preference
 */
export const setLanguage = (language) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (err) {
    console.error('Failed to set language:', err);
  }
};
