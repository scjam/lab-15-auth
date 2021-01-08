const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()
  .get('/prolific', ensureAuth, (req, res, next) => {
    User
      .prolific()
      .then(gram => res.send(gram))
      .catch(next);
  });
