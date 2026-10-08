/**
 * Array/Collection Utilities - Common array operations
 */

/**
 * Group array by key/function
 */
export const groupBy = (arr, keyOrFn) => {
  return arr.reduce((acc, item) => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Sort array by property
 */
export const sortBy = (arr, property, ascending = true) => {
  return [...arr].sort((a, b) => {
    if (a[property] < b[property]) return ascending ? -1 : 1;
    if (a[property] > b[property]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (arr, key = null) => {
  if (!key) {
    return [...new Set(arr)];
  }
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

/**
 * Find differences between two arrays
 */
export const arrayDifference = (arr1, arr2) => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Flatten array
 */
export const flatten = (arr) => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Zip arrays together
 */
export const zip = (...arrays) => {
  return arrays[0].map((_, i) => arrays.map(arr => arr[i]));
};

/**
 * Unzip array of arrays
 */
export const unzip = (arr) => {
  return arr[0].map((_, i) => arr.map(a => a[i]));
};

/**
 * Get unique values
 */
export const unique = (arr) => [...new Set(arr)];

/**
 * Filter out falsy values
 */
export const compact = (arr) => arr.filter(Boolean);

/**
 * Find by property
 */
export const findBy = (arr, property, value) => {
  return arr.find(item => item[property] === value);
};

/**
 * Filter by property
 */
export const filterBy = (arr, property, value) => {
  return arr.filter(item => item[property] === value);
};

/**
 * Index array by property
 */
export const indexBy = (arr, property) => {
  return arr.reduce((acc, item) => {
    acc[item[property]] = item;
    return acc;
  }, {});
};

/**
 * Pluck property from array of objects
 */
export const pluck = (arr, property) => {
  return arr.map(item => item[property]);
};

/**
 * Sum values in array
 */
export const sum = (arr, property = null) => {
  return arr.reduce((total, item) => {
    const value = property ? item[property] : item;
    return total + (Number(value) || 0);
  }, 0);
};

/**
 * Average values in array
 */
export const average = (arr, property = null) => {
  if (arr.length === 0) return 0;
  return sum(arr, property) / arr.length;
};

/**
 * Max value in array
 */
export const maxBy = (arr, property = null) => {
  return Math.max(...arr.map(item => property ? item[property] : item));
};

/**
 * Min value in array
 */
export const minBy = (arr, property = null) => {
  return Math.min(...arr.map(item => property ? item[property] : item));
};

/**
 * Paginate array
 */
export const paginate = (arr, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: arr.slice(startIndex, endIndex),
    page,
    pageSize,
    total: arr.length,
    totalPages: Math.ceil(arr.length / pageSize),
  };
};

/**
 * Shuffle array
 */
export const shuffle = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Move item in array
 */
export const moveItem = (arr, fromIndex, toIndex) => {
  const result = [...arr];
  const item = result.splice(fromIndex, 1)[0];
  result.splice(toIndex, 0, item);
  return result;
};

/**
 * Toggle item in array
 */
export const toggleItem = (arr, item) => {
  const index = arr.indexOf(item);
  if (index > -1) {
    return arr.filter((_, i) => i !== index);
  }
  return [...arr, item];
};
