const { Schema, model } = require('mongoose')

const SessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  latestAccess: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})

module.exports = model('Session', SessionSchema)
