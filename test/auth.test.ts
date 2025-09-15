import prisma from '../src/prisma/client';
import { api } from './helpers';

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockImplementation(async (val: string) => `hashed:${val}`),
  },
}));

jest.mock('../src/services/auth/login.services', () => ({
  __esModule: true,
  login: jest.fn().mockResolvedValue({
    user: { id: 'u1', email: 'a@b.com', name: 'A' },
    token: 'test-token',
  }),
}));

jest.mock('../src/prisma/client', () => require('./__mocks__/prisma').default);

describe('Auth routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('POST /api/auth/signup creates a user', async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', password: 'hashed' });

    const res = await api().post('/api/auth/signup').send({ email: 'a@b.com', name: 'A', password: 'p' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'u1', email: 'a@b.com', name: 'A' });
  });

  test('POST /api/auth/login returns token and user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', password: 'hashed' });
    const res = await api().post('/api/auth/login').send({ email: 'a@b.com', password: 'p' });
    // Debug body on failure
    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('Login response:', res.body);
    }
    expect(res.status).toBe(200);
  });
});


