const User = require('../models/User'); 
const bcrypt = require ('bcryptjs');


module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    const user = await User.insert({ email, passwordHash });
    return user;
  }
};
