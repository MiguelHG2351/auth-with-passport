const UserModel = require("../database/models/User");

class UserServices {
  async createUser({ username, name, email, image }) {
    const user = new UserModel({
      username,
      name,
      email,
      image,
    });
    return await user.save();
  }
  async findUser({ username }) {
    const user = await UserModel.findOne({
      username
    })
    return user
  }
}

module.exports = UserServices;
