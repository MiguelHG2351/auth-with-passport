require('dotenv').config()
const token = require('./utils')

;(async () => {
  console.log(await token.signJWT('miguel2351', '2321312bsfdf'))
})()
