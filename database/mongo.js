const mongoose = require('mongoose')

const initMongoose = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chat-app')
        console.log('Aqui estoy >:D')
    } catch {
        console.error('Algo salio terriblemente mal :(')
    }
}

module.exports = initMongoose
