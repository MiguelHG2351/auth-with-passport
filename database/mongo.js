const mongoose = require('mongoose')

const initMongoose = async () => {
    const DATABASE_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27018/chat-app'
    console.log(DATABASE_URL)
    try {
        return await mongoose.connect(DATABASE_URL)
    } catch {
        return Promise.reject('Algo salio terriblemente mal :(')
    }
}

module.exports = initMongoose
