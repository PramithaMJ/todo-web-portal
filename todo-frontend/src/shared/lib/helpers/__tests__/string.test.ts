/**
 * String Helpers Tests
 */

import { describe, it, expect } from 'vitest';
import {
  capitalize,
  toTitleCase,
  truncate,
  toSlug,
  getInitials,
  pluralize,
} from '../string';

describe('String Helpers', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should lowercase rest of string', () => {
      expect(capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle multiple spaces', () => {
      expect(toTitleCase('hello  world')).toBe('Hello  World');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });
  });

  describe('toSlug', () => {
    it('should convert to slug', () => {
      expect(toSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(toSlug('Hello @#$ World!')).toBe('hello-world');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should get initial from single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('pluralize', () => {
    it('should not pluralize singular', () => {
      expect(pluralize('task', 1)).toBe('task');
    });

    it('should pluralize multiple', () => {
      expect(pluralize('task', 2)).toBe('tasks');
    });

    it('should use custom suffix', () => {
      expect(pluralize('box', 2, 'es')).toBe('boxes');
    });
  });
});
