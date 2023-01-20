const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    emailVerified: {
        required: true,
        type: Date
    },
    image: String,
    picture: String,
})

module.exports = model('user', UserSchema)
