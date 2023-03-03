const UserModel = require("../database/models/User");

class UserServices {
  async createUser({ username, name, email, image, provider }) {
    const user = new UserModel({
      username,
      name,
      email,
      image,
      provider
    });
    return await user.save();
  }
  async findUser({ username }, { lean = false }) {
    if (lean) {
      return await UserModel.findOne({
        username,
      }).lean();
    }
    return await UserModel.findOne({
      username,
    });
  }
}

module.exports = UserServices;
