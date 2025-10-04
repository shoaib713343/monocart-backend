// src/modules/users/user.test.ts

// 1. Mock the services that make external connections
jest.mock('../../utils/email');
jest.mock('../../server', () => ({
  wss: {
    clients: new Set(), // Provide a fake clients set
  },
}));

import request from 'supertest';
import app from '../../app';
import { pool } from '../../db'; // 2. Import the database pool

describe('User Module', () => {
  // 3. Add the afterAll hook to close the database connection
  afterAll(async () => {
    await pool.end();
  });

  // --- Your tests (no changes needed here) ---

  it('should register a new user successfully', async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({
        fullName: 'Test User',
        email: uniqueEmail,
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toEqual(uniqueEmail);
  });

  it('should return a 400 error for invalid data', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({
        fullName: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should return a 409 error for a duplicate email', async () => {
    const uniqueEmail = `conflict_${Date.now()}@example.com`;
    const userData = {
      fullName: 'Conflict User',
      email: uniqueEmail,
      password: 'password123',
    };

    await request(app).post('/api/v1/users/register').send(userData);
    const res = await request(app).post('/api/v1/users/register').send(userData);

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('User with this email already exists');
  });
});