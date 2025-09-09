import prisma from '../src/prisma/client';
import { api, makeAuthHeader } from './helpers';

jest.mock('../src/prisma/client', () => require('./__mocks__/prisma').default);

describe('Chat routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A' });
  });

  test('POST /api/chat creates a chat', async () => {
    (prisma.chat.create as jest.Mock).mockResolvedValue({ id: 'c1', name: 'General' });
    const res = await api()
      .post('/api/chat')
      .set('Authorization', makeAuthHeader('u1'))
      .send({ name: 'General' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'c1', name: 'General' });
  });

  test('GET /api/chat lists user chats', async () => {
    (prisma.chat.findMany as jest.Mock).mockResolvedValue([{ id: 'c1', name: 'General' }]);
    const res = await api().get('/api/chat').set('Authorization', makeAuthHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1', name: 'General' }]);
  });

  test('GET /api/chat/:id returns a chat', async () => {
    (prisma.chat.findUnique as jest.Mock).mockResolvedValue({ id: 'c1', name: 'General', users: [] });
    const res = await api().get('/api/chat/c1').set('Authorization', makeAuthHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'c1', name: 'General' });
  });

  test('PUT /api/chat/:id updates a chat', async () => {
    (prisma.chat.update as jest.Mock).mockResolvedValue({ id: 'c1', name: 'New' });
    const res = await api().put('/api/chat/c1').set('Authorization', makeAuthHeader('u1')).send({ name: 'New' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'c1', name: 'New' });
  });

  test('DELETE /api/chat/:id deletes a chat', async () => {
    (prisma.chat.delete as jest.Mock).mockResolvedValue({ id: 'c1', name: 'New' });
    const res = await api().delete('/api/chat/c1').set('Authorization', makeAuthHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'c1' });
  });
});


