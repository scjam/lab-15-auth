const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/comments', ensureAuth, (req, res, next) => {
    Comment
      .insert({ ...req.body, commentBy: req.user.id })
      .then(comment => res.send(comment))
      .catch(next);
  })
  
  .delete('/comments/:id', ensureAuth, (req, res, next) => {
    Comment
      .delete(req.params.id, req.user.id);
  });
