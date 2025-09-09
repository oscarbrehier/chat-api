import 'jest';
jest.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockImplementation(async (val: string) => `hashed:${val}`),
  },
}));

// Ensure env vars exist for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Silence console during tests except errors
const originalLog = console.log;
const originalWarn = console.warn;
if (process.env.VERBOSE_TESTS !== '1') {
  console.log = jest.fn();
  console.warn = jest.fn();
}

afterAll(async () => {
  console.log = originalLog;
  console.warn = originalWarn;
});


