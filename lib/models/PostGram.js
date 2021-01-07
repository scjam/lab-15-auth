const pool = require('../utils/pool');

module.exports = class PostGram {
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

    static async insert(gram) {
        const { rows } = await pool.query(
            'INSERT INTO post_grams (user_id, photo_url, tags) VALUES($1, $2, $3) RETURNING *', [gram.user_id, gram.photo_url, gram.tags]
        );
        return new PostGram(rows[0]);
    }
