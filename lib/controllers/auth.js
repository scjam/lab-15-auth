const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router() 
  .post('/signup', (req, res, next) => {
    UserService
      .create(req.body)
      .then(user => res.send(user))
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      .authorize(req.body)
      .then(user => res.send(user))
      .catch(next);
  });
