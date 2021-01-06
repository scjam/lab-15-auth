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
    // await Promise.all([
    //   UserService.create({ email: 'test@test.com', password: 'password' }),
    //   UserService.create({ email: 'test2@test.com', password: 'password2' }),
    //   UserService.create({ email: 'test3@test.com', password: 'password3' })
    // ]);

    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'test@test.com', 
        passwordHash: 'password' 
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          passwordHash: 'password'
        });
      });
  });
});
