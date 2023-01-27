const mongoose = require('mongoose')

const initMongoose = async () => {
    try {
        return await mongoose.connect('mongodb://127.0.0.1:27017/chat-app')
    } catch {
        return Promise.reject('Algo salio terriblemente mal :(')
    }
}

module.exports = initMongoose
