import prisma from '../src/prisma/client';
import { api, makeAuthHeader } from './helpers';

jest.mock('../src/prisma/client', () => require('./__mocks__/prisma').default);

describe('Messages routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A' });
  });

  test('POST /api/messages sends a message', async () => {
    (prisma.chat.findUnique as jest.Mock).mockResolvedValue({ id: 'c1', users: [] });
    (prisma.message.create as jest.Mock).mockResolvedValue({ id: 'm1', chatId: 'c1', senderId: 'u1', content: 'hi' });

    const res = await api()
      .post('/api/messages')
      .set('Authorization', makeAuthHeader('u1'))
      .send({ chatId: 'c1', content: 'hi' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'm1', chatId: 'c1', content: 'hi' });
  });

  test('GET /api/messages/:chatId lists messages', async () => {
    (prisma.chat.findUnique as jest.Mock).mockResolvedValue({ id: 'c1', messages: [{ id: 'm1', content: 'hi' }] });
    const res = await api().get('/api/messages/c1').set('Authorization', makeAuthHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'm1', content: 'hi' }]);
  });

  test('PUT /api/messages/:id updates a message', async () => {
    (prisma.message.findUnique as jest.Mock).mockResolvedValue({ id: 'm1', senderId: 'u1' });
    (prisma.message.update as jest.Mock).mockResolvedValue({ id: 'm1', content: 'edited' });
    const res = await api()
      .put('/api/messages/m1')
      .set('Authorization', makeAuthHeader('u1'))
      .send({ content: 'edited' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'm1', content: 'edited' });
  });

  test('DELETE /api/messages/:id deletes a message', async () => {
    (prisma.message.delete as jest.Mock).mockResolvedValue({ id: 'm1' });
    const res = await api().delete('/api/messages/m1').set('Authorization', makeAuthHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'm1' });
  });
});


