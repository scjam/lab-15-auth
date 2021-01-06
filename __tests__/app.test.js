const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('lab-15-auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('allows the user to signup via POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'test@test.com', 
        password: 'password' 
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          password: 'password'
        });
      });
  });
});
