const { Schema, model } = require("mongoose");

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
  image: {
    type: String,
    required: true,  
    trim: true
  }
}, {
  timestamps: true
});

module.exports = model("User", UserSchema);
