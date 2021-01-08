const pool = require('../utils/pool');

module.exports = class User {
    id;
    email;
    passwordHash;
    profilePhotoURL;

    constructor(row) {
      this.id = row.id;
      this.email = row.email;
      this.passwordHash = row.password_hash;
      this.profilePhotoURL = row.profile_photo_url;
    }

    static async insert(user) {
      const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash, profile_photo_url) VALUES($1, $2, $3) RETURNING *', [user.email, user.passwordHash, user.profilePhotoURL]
      );

      return new User(rows[0]);
    }

    static async findByEmail(email) {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
      );

      if(!rows[0]) throw new Error(`No user with email ${email} found`);
      return new User(rows[0]);
    }

    static async prolific() {
      const { rows } = await pool.query(
        `SELECT 
          users.*,
          COUNT(post_grams.*) 
        FROM users
        INNER JOIN post_grams
        ON users.id = post_grams.user_id
        GROUP BY users.id
        ORDER BY count DESC
        LIMIT 10
        `
      );
      return rows.map(row => new User(row));
    }

    toJSON() {
      const json = { ...this };
      delete json.passwordHash;
      return json;
    }
};
