const pool = require('../utils/pool');

module.exports = class PostGram {
    id;
    userId;
    photoURL;
    caption;
    tags;

    constructor(row) {
      this.id = row.id;
      this.userId = row.user_id;
      this.photoURL = row.photo_url;
      this.caption = row.caption;
      this.tags = row.tags;
    }

    static async insert(gram) {
      const { rows } = await pool.query(
        'INSERT INTO post_grams (user_id, photo_url, caption, tags) VALUES($1, $2, $3, $4) RETURNING *', [gram.userId, gram.photoURL, gram.caption, gram.tags]
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

    static async update(id, gram) {
      const { rows } = await pool.query(
        `UPDATE post_grams
        SET caption=$1
        WHERE id=$2 AND user_id=$3
        RETURNING *
        `, [gram.caption, id, gram.userId]
      );

      return new PostGram(rows[0]);
    }

    static async delete(id, gram) {
      const { rows } = await pool.query(
        `DELETE FROM post_grams
        WHERE id=$1 AND user_id=$2
        RETURNING *
        `, [id, gram.userId]
      );

      return new PostGram(rows[0]);
    }

    static async findPopular() {
      const { rows } = await pool.query(
        `SELECT 
          post_grams.*,
          COUNT(comments) 
        FROM post_grams
        INNER JOIN comments
        ON post_grams.id = comments.post
        GROUP BY post_grams.id
        ORDER BY count DESC
        LIMIT 10
        `
      );
      return rows.map(row => new PostGram(row));
    }
};
