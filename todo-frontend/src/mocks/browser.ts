/**
 * MSW Browser Worker
 * Service worker setup for browser mocking
 */

import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { taskHandlers } from './handlers/task.handlers';

export const worker = setupWorker(...authHandlers, ...taskHandlers);
