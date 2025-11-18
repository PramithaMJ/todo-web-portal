/**
 * Validators Tests
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isEmpty,
  isLengthValid,
} from '../validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong password', () => {
      expect(isValidPassword('Password123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('nouppercase123')).toBe(false);
      expect(isValidPassword('NOLOWERCASE123')).toBe(false);
      expect(isValidPassword('NoNumbers')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should detect non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('isLengthValid', () => {
    it('should validate length in range', () => {
      expect(isLengthValid('hello', 1, 10)).toBe(true);
    });

    it('should reject length out of range', () => {
      expect(isLengthValid('hi', 5, 10)).toBe(false);
      expect(isLengthValid('hello world', 1, 5)).toBe(false);
    });
  });
});
