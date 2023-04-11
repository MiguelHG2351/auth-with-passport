const db = require('../database/mongo')
db().then(confirm => console.log('Todo god'))
const Session = require('../database/models/Session')

const session = new Session({
  browser: 'Chrome',
  os: 'Windows',
  version: '110.0.1587',
  ip: '192.168.1.1',
  latestAccess: Date.now(),
  userId: '5f9f1b0b0b9b9c0b3c8c1b1a',
})

session.token = 'aewsdfgadfasdslgsfdmklh'

console.log(session)
session.save()