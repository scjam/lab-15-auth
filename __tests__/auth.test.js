const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('auth routes', () => {
  let agent;
  let user;

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

    agent = await request.agent(app);
    user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'profile.jpg'
    });
  });

  afterAll(() => {
    pool.end();
  });

  it('allows the user to signup via POST', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'test@test.com', 
        password: 'password',
        profilePhotoURL: 'profile.jpg'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          profilePhotoURL: 'profile.jpg'
        });
      });
  });

  it('allows the user to login via POST', async() => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(res.body).toEqual({
      id: user.id,
      email: 'test@test.com',
      profilePhotoURL: 'profile.jpg'
    });
  });

  it('verifies a user is logged in', async() => {
    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    const res = await agent
      .get('/api/v1/auth/verify');

    expect(res.body).toEqual({
      id: user.id,
      email: 'test@test.com',
      profilePhotoURL: 'profile.jpg'
    });
  });
});
