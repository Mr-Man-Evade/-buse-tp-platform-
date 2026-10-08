/**
 * Utils - Central export point for all utility functions
 */

export * from './storage';
export * from './formatters';
export * from './errors';
export * from './validators';
export * from './arrays';

/**
 * Object utilities
 */

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const mergeObjects = (target, source) => ({
  ...target,
  ...source,
});

export const pickProperties = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};

export const omitProperties = (obj, keys) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Type utilities
 */

export const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
export const isArray = (val) => Array.isArray(val);
export const isString = (val) => typeof val === 'string';
export const isNumber = (val) => typeof val === 'number' && !isNaN(val);
export const isBoolean = (val) => typeof val === 'boolean';
export const isFunction = (val) => typeof val === 'function';
export const isNull = (val) => val === null;
export const isUndefined = (val) => val === undefined;
export const isEmpty = (val) => {
  if (val === null || val === undefined) return true;
  if (isString(val)) return val.trim().length === 0;
  if (isArray(val)) return val.length === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
};

/**
 * Delay utility
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Debounce utility
 */
export const debounce = (fn, ms = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};

/**
 * Throttle utility
 */
export const throttle = (fn, ms = 300) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Memoize utility
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Retry utility
 */
export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxAttempts - 1) {
        await delay(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  throw lastError;
};
