require('dotenv').config()
const token = require('../utils/token');


(async () => {
  const accessToken = await token.generateAccessToken({
    userId: '6414a6bba0f35f4991f20885',
    email: 'miguelcraftpe0@gmail.com',
    name: 'Miguel Hernández Gaitan',
    username: 'miguelcraftpe0',
    restrictedSession: false
  })
  
  const refreshToken = await token.generateRefreshToken({
    sessionId: '6430905a0d5d914929ad7ec9'
  })

  console.log('accessToken: ', accessToken)
  console.log('refreshToken: ', refreshToken)
})()

