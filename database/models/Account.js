const { Schema, model } = require("mongoose");

const AccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ["google", "local", "github"],
    required: true
  },
  account_state: { // If account is enable
    type: String,
    required: true,
    enum: [
      'enable',
      'disable'
    ]
  },
});

module.exports = model('account', AccountSchema)
