const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('post gram routes', () => {
  let agent;
  let user;

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

    agent = request.agent(app);

    user = await agent
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'profile.jpg'
      });
  });
  
  afterAll(() => {
    pool.end();
  });

  it('creates a PostGram via POST', async() => {
    const res = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg',
        caption: 'caption',
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
      caption: 'caption',
      tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
    });
  });

  it('gets all PostGrams via GET', async() => {
    const gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg',
        caption: 'caption',
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ],
      });

    const res = await agent
      .get('/api/v1/post_grams');
      
    expect(res.body).toEqual([{
      id: expect.any(String),
      userId: user.body.id, 
      photoURL: 'photo.jpg',
      caption: 'caption',
      tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
    }]);
  });

  it('gets all PostGrams by id and associated comments via GET', async() => {
    const gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg',
        caption: 'caption',
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
      });

    const res = await agent
      .get(`/api/v1/post_grams/${gram.body.id}`);
      
    expect(res.body).toEqual({
      id: expect.any(String),
      comments: expect.anything(),
      userId: user.body.id, 
      photoURL: 'photo.jpg',
      caption: 'caption', 
      tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
    });
  });

  it('updates a posts caption, only allowing you to do so if you have authorization', async() => {
    let gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg',
        caption: 'caption',
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
      });

    gram = await agent
      .patch(`/api/v1/post_grams/${gram.body.id}`)
      .send({
        caption: 'this is my new caption'
      });

    const res = await agent
      .get(`/api/v1/post_grams/${gram.body.id}`);
      
    expect(res.body).toEqual({
      id: expect.any(String),
      comments: expect.anything(),
      userId: user.body.id, 
      photoURL: 'photo.jpg',
      caption: 'this is my new caption', 
      tags:
         [
           'tag',
           'tagged',
           'tagger'
         ]
    });
  });

  it('deletes a post, only allowing you to do so if you have authorization', async() => {
    const gram = await agent
      .post('/api/v1/post_grams')
      .send({ 
        userId: user.id, 
        photoURL: 'photo.jpg',
        caption: 'caption',
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
      });

    const res = await agent
      .delete(`/api/v1/post_grams/${gram.body.id}`);
      
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id, 
      photoURL: 'photo.jpg',
      caption: 'caption', 
      tags:
         [
           'tag',
           'tagged',
           'tagger'
         ]
    });
  });

  it('gets top 10 commented on PostGrams via GET', async() => {
    const grams = await agent
      .post('/api/v1/post_grams')
      .send(
        { 
          userId: user.id, 
          photoURL: 'photo1.jpg',
          caption: 'caption',
          tags:
          [ 
            'tag',
            'tagged',
            'tagger'
          ],
        });

    const comments = await agent
      .post('/api/v1/comments')
      .send(
        {
          comment: 'hello world',
          commentBy: user.id,
          post: grams.body.id
        });

    const res = await agent
      .get('/api/v1/post_grams');
      
    expect(res.body).toEqual([{
      id: expect.any(String),
      userId: user.body.id, 
      photoURL: 'photo1.jpg',
      caption: 'caption',
      tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ]
    }]);
  });
});
