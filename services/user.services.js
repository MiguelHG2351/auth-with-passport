const UserModel = require('../models/User')

class UserServices {
  
  createUser(data) {
    const user = new UserModel(data)
    return user.save()
  }
}

module.exports = UserServices