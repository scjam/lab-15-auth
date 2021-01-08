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
    const gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg', 
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ],
      });
    const res = await agent
      .post('/api/v1/comments')
      .send({
        comment: 'hello world',
        commentBy: user.id,
        post: gram.body.id
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      comment: 'hello world',
      commentBy: user.body.id,
      post: gram.body.id
    });
  });

  it('deletes a comment via DELETE', async() => {
    const agent = request.agent(app);
    const user = await agent
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'profile.jpg'
      });
    const gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg', 
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ],
      });
    const comment = await agent
      .post('/api/v1/comments')
      .send({
        comment: 'text',
        commentBy: user.id,
        post: gram.body.id
      });
    
    const res = await agent
      .delete(`/api/v1/comments/${comment.body.id}`);

    expect(res.body).toEqual(comment.body);
  });
});
