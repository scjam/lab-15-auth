const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const PostGram = require('../models/PostGram');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    PostGram
      .insert({ ...req.body, userId: req.user.id })
      .then(gram => res.send(gram))
      .catch(next);
  });
