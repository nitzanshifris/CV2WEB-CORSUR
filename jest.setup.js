// Add custom jest matchers
import '@testing-library/jest-dom';

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
};

// Global test timeout
jest.setTimeout(10000);

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
