const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { globalAgent } = require('https');

describe('lab-15-auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    pool.end();
  });

  it('allows the user to signup via POST', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'test@test.com', 
<<<<<<< HEAD
<<<<<<< HEAD
        passwordHash: 'password' 
=======
        password: 'password',
        profilePhotoURL: 'profile.jpg'
>>>>>>> 1d684b6dfffd3bc4cc778ab1b457eb9b1c35c003
=======
        password: 'password',
        profilePhotoURL: 'profile.jpg'
>>>>>>> b51365e52f8ab9f5115500d7a191067d85f0b7fb
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          profilePhotoURL: 'profile.jpg'
        });
      });
  });

  it('allows the user to login via post', async() => {
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'profile.jpg'
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
      profilePhotoURL: 'profile.jpg'
    });
  });

  it('verifies a user is logged in', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'profile.jpg'
    });

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
