const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('lab-15-auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  afterAll(() => {
    pool.end();
  });

  it('creates a PostGram via POST', async() => {
    const agent = request.agent(app);
    const user = await agent
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'profile.jpg'
      });
    const res = await agent
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
      
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id, 
      photoURL: 'photo.jpg', 
      tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ],
    
    });
  });
});
