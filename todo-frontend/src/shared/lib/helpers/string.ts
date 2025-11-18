/**
 * String Helper Functions
 * Pure utility functions for string manipulation
 */

/**
 * Capitalizes first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts string to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncates string with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Removes extra whitespace
 */
export const normalizeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Converts string to slug format
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Escapes HTML special characters
 */
export const escapeHtml = (str: string): string => {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
};

/**
 * Generates random string
 */
export const randomString = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Checks if string contains substring (case-insensitive)
 */
export const containsIgnoreCase = (str: string, search: string): boolean => {
  return str.toLowerCase().includes(search.toLowerCase());
};

/**
 * Extracts initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Pluralizes word based on count
 */
export const pluralize = (word: string, count: number, suffix: string = 's'): string => {
  return count === 1 ? word : word + suffix;
};
