/**
 * Mock User Data
 */

import type { User } from '../../entities/user/model/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  role: 'user',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};
