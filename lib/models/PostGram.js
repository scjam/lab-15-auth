const pool = require('../utils/pool');
const Comment = require('./Comment');

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

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT
          post_grams.*,
          json_agg(comments.*) AS comments
        FROM post_grams
        LEFT JOIN comments
        ON comments.post = post_grams.id
        WHERE post_grams.id = $1
        GROUP BY post_grams.id`, [id]
      );

      if(!rows[0]) throw new Error(`No Post with id ${id}`);

      return {
        ...new PostGram(rows[0]),
        comments: rows[0].comments
      };
    }
};

