// Minimal Jest mock for Prisma client used in services
const user = {
  findUnique: jest.fn(),
  create: jest.fn(),
};

const chat = {
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const message = {
  create: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export default { user, chat, message } as any;



