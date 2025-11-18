/**
 * User Entity Types
 * Pure domain types for User entity
 */

export type UserId = string;
export type UserRole = 'user' | 'admin';

/**
 * Core User entity interface
 */
export interface User {
  id: UserId;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User profile information
 */
export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
  avatar?: string;
}
