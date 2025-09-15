import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

export function makeAuthHeader(userId = 'user-1') {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  return `Bearer ${token}`;
}

export function api() {
  return request(app);
}



