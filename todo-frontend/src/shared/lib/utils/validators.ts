/**
 * Validation Utilities
 * Pure validation functions for common use cases
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return minLength && hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a string is empty or only whitespace
 */
export const isEmpty = (value: string): boolean => {
  return value.trim().length === 0;
};

/**
 * Validates string length range
 */
export const isLengthValid = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.length;
  return length >= min && length <= max;
};

/**
 * Validates if a value is a positive integer
 */
export const isPositiveInteger = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};

/**
 * Validates date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  return date.getTime() > Date.now();
};

/**
 * Validates date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return date.getTime() < Date.now();
};
