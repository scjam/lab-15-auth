const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    comment;
    commentBy;
    post;

    constructor(row) {
      this.id = row.id;
      this.comment = row.comment;
      this.commentBy = row.comment_by;
      this.post = row.post;
    }

    static async insert({ comment, commentBy, post }) {
      const { rows } = await pool.query(
        'INSERT INTO comments (comment, comment_by, post) VALUES ($1, $2, $3) RETURNING *',
        [comment, commentBy, post]
      );

      return new Comment(rows[0]);
    }

    static async delete(id, commentBy) {
      const { rows } = await pool.query(
        'DELETE FROM comments WHERE id=$1 AND comment_by=$2 RETURNING *',
        [id, commentBy]
      );

      return new Comment(rows[0]);
    }

};
