/**
 * ErrorUtils.ts
 * Centralized error handling and messaging utilities.
 * Provides generic user-facing error messages to avoid leaking sensitive information.
 */

// Error categories
export enum ErrorCategory {
  AUTH = 'authentication',
  DATA = 'data',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// Define specific error types for each category
export type AuthErrorType = 'SIGN_IN_ERROR' | 'SIGN_OUT_ERROR' | 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'PROFILE_ERROR';
export type DataErrorType = 'FETCH_ERROR' | 'SAVE_ERROR' | 'NOT_FOUND' | 'VALIDATION_ERROR';
export type NetworkErrorType = 'CONNECTION_ERROR' | 'TIMEOUT' | 'API_ERROR';
export type UnknownErrorType = 'GENERAL_ERROR';

// Union type of all error types
export type ErrorType = AuthErrorType | DataErrorType | NetworkErrorType | UnknownErrorType;

// Define types for the error messages structure
type ErrorMessages = {
  [ErrorCategory.AUTH]: Record<AuthErrorType, string>;
  [ErrorCategory.DATA]: Record<DataErrorType, string>;
  [ErrorCategory.NETWORK]: Record<NetworkErrorType, string>;
  [ErrorCategory.UNKNOWN]: Record<UnknownErrorType, string>;
};

// Generic user-facing error messages
export const USER_FACING_ERRORS: ErrorMessages = {
  [ErrorCategory.AUTH]: {
    SIGN_IN_ERROR: 'Unable to sign in. Please verify your credentials and try again.',
    SIGN_OUT_ERROR: 'There was an issue signing out. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    UNAUTHORIZED: 'You\'re not authorized to perform this action.',
    PROFILE_ERROR: 'We couldn\'t load your profile information.'
  },
  [ErrorCategory.DATA]: {
    FETCH_ERROR: 'Unable to load the requested information. Please try again.',
    SAVE_ERROR: 'Changes couldn\'t be saved. Please try again.',
    NOT_FOUND: 'The requested information could not be found.',
    VALIDATION_ERROR: 'There was an issue with the provided information.'
  },
  [ErrorCategory.NETWORK]: {
    CONNECTION_ERROR: 'Connection issue detected. Please check your internet connection.',
    TIMEOUT: 'The request timed out. Please try again.',
    API_ERROR: 'There was an issue connecting to the service.'
  },
  [ErrorCategory.UNKNOWN]: {
    GENERAL_ERROR: 'Something went wrong. Please try again or contact support if the issue persists.'
  }
};

// Internal development error logging (doesn't expose details to users)
export const logErrorDetails = (category: ErrorCategory, errorType: string, details: unknown): void => {
  // In development, log to console
  if (import.meta.env.DEV) {
    console.error(`[${category}][${errorType}]`, details);
  } 
  
  // In production, this could send to a logging service
  // But wouldn't display in the console or to users
};

// Map technical errors to user-friendly messages
export const getUserFriendlyError = (
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  errorType: ErrorType | string = 'GENERAL_ERROR'
): string => {
  try {
    // Safety check for category
    if (!(category in USER_FACING_ERRORS)) {
      return USER_FACING_ERRORS[ErrorCategory.UNKNOWN].GENERAL_ERROR;
    }
    
    // Type assertion to help TypeScript understand our structure
    const errorsByCategory = USER_FACING_ERRORS[category] as Record<string, string>;
    
    // Check if the error type exists in this category
    if (errorType in errorsByCategory) {
      return errorsByCategory[errorType];
    }
    
    // Fallback to general error
    return USER_FACING_ERRORS[ErrorCategory.UNKNOWN].GENERAL_ERROR;
  } catch {
    // Ultimate fallback if anything goes wrong
    return USER_FACING_ERRORS[ErrorCategory.UNKNOWN].GENERAL_ERROR;
  }
};

// Function to handle errors consistently across the app
export const handleError = (
  error: unknown,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  errorType: string = 'GENERAL_ERROR'
): string => {
  // Log the detailed error (only visible in development)
  logErrorDetails(category, errorType, error);
  
  // Return a user-friendly error message (safe for display)
  return getUserFriendlyError(category, errorType);
};
