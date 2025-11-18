/**
 * Auth Handlers
 * MSW handlers for authentication endpoints
 */

import { http, HttpResponse } from 'msw';
import { mockUser } from '../data/users';
import type { AuthResponse } from '../../entities/session/model/types';
import type { User } from '../../entities/user/model/types';

const API_BASE_URL = 'http://localhost:8080/api';

// In-memory user database for mocking
const mockUsers: User[] = [
  {
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'john-user',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

// Mock password storage (in real app, passwords are hashed)
const mockPasswords = new Map<string, string>([
  ['john.doe@example.com', 'password123'],
  ['demo@example.com', 'demo123'],
]);

const createAuthResponse = (user: User): AuthResponse => {
  // Create a simple JWT-like token for mocking
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId: user.id, email: user.email, name: user.name }));
  const signature = 'mock-signature';
  const token = `${header}.${payload}.${signature}`;
  
  return {
    accessToken: token,
    refreshToken: `mock-refresh-token-${user.id}`,
    user,
    expiresIn: 3600,
  };
};

export const authHandlers = [
  // Login with email/password
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const storedPassword = mockPasswords.get(email);
    if (storedPassword !== password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return HttpResponse.json(createAuthResponse(user));
  }),

  // Register new user
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string; name: string };
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return HttpResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      return HttpResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);
    mockPasswords.set(email, password);

    return HttpResponse.json(createAuthResponse(newUser), { status: 201 });
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Refresh token
  http.post(`${API_BASE_URL}/auth/refresh`, () => {
    return HttpResponse.json(createAuthResponse(mockUser));
  }),

  // Get current user
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return HttpResponse.json(mockUser);
  }),

  // Google OAuth URL
  http.get(`${API_BASE_URL}/auth/oauth/google`, () => {
    return HttpResponse.json({
      url: 'https://accounts.google.com/o/oauth2/auth?mock=true',
      state: 'mock-state-google',
    });
  }),

  // GitHub OAuth URL
  http.get(`${API_BASE_URL}/auth/oauth/github`, () => {
    return HttpResponse.json({
      url: 'https://github.com/login/oauth/authorize?mock=true',
      state: 'mock-state-github',
    });
  }),

  // OAuth callback
  http.post(`${API_BASE_URL}/auth/oauth/callback/:provider`, () => {
    return HttpResponse.json(createAuthResponse(mockUser));
  }),
];
