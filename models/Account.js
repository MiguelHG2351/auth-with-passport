const { Schema, model } = require("mongoose");

const AccountSchema = new Schema({
  userId: String,
  provider: {
    type: String,
    enum: ["google", "facebook", "github"],
  },
  scope: String,
  session_state: { // If account is enable
    type: String,
    required: true,
    enum: [
      'enable',
      'disable'
    ]
  }
});
