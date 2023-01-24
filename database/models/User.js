const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  emailVerified: {
    required: true,
    type: Date,
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
