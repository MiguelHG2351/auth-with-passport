const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require('../../utils/token')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    enum: ["google", "facebook", "github"],
    required: true
  },
  image: {
    type: String,
    required: true,  
    trim: true
  }
}, {
  timestamps: true
});

UserSchema.methods.verifyPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

UserSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = async function ({ username, userId }) {
  return await generateAccessToken({
    username,
    userId
  })
}

UserSchema.methods.generateRefreshToken = async function ({ sessionId }) {
  return await generateRefreshToken({
    sessionId
  })
}

module.exports = model("User", UserSchema);
