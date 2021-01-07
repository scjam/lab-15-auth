const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('lab-15-auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('allows the user to signup via POST', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'test@test.com', 
        password: 'password' 
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com'
        });
      });
  });

  it('allows the user to login via post', async() => {
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(res.body).toEqual({
      id: user.id,
      email: 'test@test.com',
    });
  });
});
