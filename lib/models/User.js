const pool = require('../utils/pool');

module.exports = class User {
    id;
    email;
    passwordHash;

    constructor(row) {
      this.id = row.id;
      this.email = row.email;
      this.passwordHash = row.password_hash;
    }

    static async insert(user) {
      const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES($1, $2) RETURNING *;', [user.email, user.passwordHash]
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

    toJSON() {
      const json = { ...this };
      delete json.passwordHash;
      return json;
    }
};
