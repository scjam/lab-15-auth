const pool = require('../utils/pool');

module.exports = class PostGram {
    id;
    userId;
    photoURL;
    tags;

    constructor(row) {
      this.id = row.id;
      this.userId = row.user_id;
      this.photoURL = row.photo_url;
      this.tags = row.tags;
    }

    static async insert(gram) {
      const { rows } = await pool.query(
        'INSERT INTO post_grams (user_id, photo_url, tags) VALUES($1, $2, $3) RETURNING *', [gram.userId, gram.photoURL, gram.tags]
      );
      return new PostGram(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM post_grams'
      );
      return rows.map(row => new PostGram(row));
    }

};
