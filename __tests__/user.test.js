const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('lab-15-post user BONUS routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  afterAll(() => {
    pool.end();
  });

  it('finds top 10 posters', async() => {
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
        caption: 'caption',
        tags:
         [ 
           'tag',
           'tagged',
           'tagger'
         ],
      });
    const res = await agent
      .get('/api/v1/user/prolific');
      
    expect(res.body).toEqual([{
      'email': 'test@test.com',
      'id': '1',
      'profilePhotoURL': 'profile.jpg'
    }]);
  });
});
