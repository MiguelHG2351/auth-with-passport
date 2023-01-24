const { Schema, model } = require("mongoose");

const AccountSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ["google", "facebook", "github"],
    required: true
  },
  session_state: { // If account is enable
    type: String,
    required: true,
    enum: [
      'enable',
      'disable'
    ]
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
});

module.exports = model('account', AccountSchema)
