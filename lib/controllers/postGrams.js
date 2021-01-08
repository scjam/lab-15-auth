const { Router, request } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const PostGram = require('../models/PostGram');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    PostGram
      .insert({ ...req.body, userId: req.user.id })
      .then(gram => res.send(gram))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    PostGram
      .find()
      .then(gram => res.send(gram))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    PostGram
      .findById(req.params.id)
      .then(gram => res.send(gram))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    PostGram
      .update(req.params.id, { ...req.body, userId: req.user.id })
      .then(gram => res.send(gram))
      .catch(next);
  });
  


