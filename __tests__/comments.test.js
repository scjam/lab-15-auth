const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('comments routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  afterAll(() => {
    pool.end();
  });

  it('creates a comment via POST', async() => {
    const agent = request.agent(app);
    const user = await agent
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'profile.jpg'
      });

    const res = await agent
      .post('/api/v1/comments')
      .send({
        comment: 'hello world',
        commentBy: user.id,
        post: expect.any(String)
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      comment: 'hello world',
      commentBy: user.id,
      post: expect.any(String)
    });
  });

  it('deletes a comment via DELETE', async() => {
    const comment = await UserService.create({
      comment: 'text',
      commentBy: '',
      post: ''
    });
    
    const res = await request(app)
      .delete(`/api/v1/comments/${comment.id}`);

    expect(res.body).toEqual(comment);
  });
});
