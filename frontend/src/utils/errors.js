/**
 * Error Utilities - Consistent error handling patterns
 */

/**
 * Custom Application Error
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'AppError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message, errors = {}) {
    super(message, 400, errors);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication Error
 */
export class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Network Error
 */
export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Parse API error response
 */
export const parseApiError = (error) => {
  // Handle axios errors
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error || data?.message || error.message || 'An error occurred';
    return {
      statusCode: status,
      message,
      data: data?.data,
      isApiError: true,
    };
  }

  // Handle network errors
  if (error.request && !error.response) {
    return {
      statusCode: 0,
      message: 'Network error. Please check your connection.',
      isNetworkError: true,
    };
  }

  // Handle other errors
  return {
    statusCode: 500,
    message: error.message || 'An unexpected error occurred',
    isUnknownError: true,
  };
};

/**
 * Get user-friendly error message
 */
export const getUserErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error instanceof ValidationError) {
    return 'Please check your input and try again';
  }

  if (error instanceof AuthError) {
    return 'Please log in to continue';
  }

  if (error instanceof AuthorizationError) {
    return 'You do not have permission to access this resource';
  }

  if (error instanceof NotFoundError) {
    return 'The resource you are looking for was not found';
  }

  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again';
  }

  if (error.response) {
    return error.response.data?.error || error.response.data?.message || error.message || 'An error occurred';
  }

  if (error.request) {
    return 'Network error. Please check your connection';
  }

  return error.message || 'An unexpected error occurred';
};

/**
 * Handle promise errors consistently
 */
export const handlePromiseError = (error, defaultMessage = 'An error occurred') => {
  console.error('Promise error:', error);
  const parsed = parseApiError(error);
  return {
    message: parsed.message || defaultMessage,
    ...parsed,
  };
};

/**
 * Log error to console with context
 */
export const logError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ');
  if (typeof errors === 'object') {
    return Object.values(errors)
      .flat()
      .join(', ');
  }
  return 'Validation error';
};
