const pool = require('../utils/pool');

module.exports = class User {
    id;
    user_id;
    photo_url;
    tags;

    constructor(row) {
      this.id = row.id;
      this.user_id = row.user_id;
      this.photoURL = row.photo_url;
      this.tags = row.tags;
    }

    