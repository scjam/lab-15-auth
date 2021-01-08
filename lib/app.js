const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./controllers/auth'));
app.use('/api/v1/user', require('./controllers/user'));
app.use('/api/v1/post_grams', require('./controllers/postGrams'));
app.use('/api/v1/comments', require('./controllers/comments'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
