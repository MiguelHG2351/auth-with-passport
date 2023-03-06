require('dotenv').config()
const mongoDBInit = require('./database/mongo')
const Session = require('./database/models/Session')

mongoDBInit()
  .then(() => console.log("Database is connected"))
  .catch((err) => console.error(err));

(async () => {
  const count = await Session.countDocuments({
    userId: '63fcdec9beff0678eafa2f75',
    // userId: user._id,
  });

  console.log(count)
})()
