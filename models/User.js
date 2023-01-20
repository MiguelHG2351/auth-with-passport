const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    provider: {
        type: 'string',
        enum: ['google', 'facebook', 'github']
    },
    picture: String,
})


module.exports = model('user', UserSchema)
