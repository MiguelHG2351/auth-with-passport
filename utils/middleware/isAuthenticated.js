const Session = require('../../database/models/Session')
const { decodeAccessToken, decodeRefreshToken, generateAccessToken } = require('../token')

module.exports = async function isAuthenticated(req, res) {
  const accessToken = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token

  if(!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  console.log('Tokens')
  console.log(accessToken)
  console.log(refreshToken)
  // try descode token
  try {
    const sessionToken = await (await decodeRefreshToken(refreshToken)).payload
    console.log('decode tokens')
    console.log(sessionToken)
    
    if(!accessToken) {
      const userSession = await Session.findById(sessionToken.sessionId).populate('userId').lean()
      console.log('find user session')
      console.log(userSession)
      // if(!userSession) {
      //   // create a new token
      //   // const user = await userSession
      //   const newToken = await generateAccessToken()
      // }
      res.status(401).json({ message: 'Session', userSession })
      // check refesh token
    }
    const userToken = await decodeAccessToken(accessToken)
    console.log(userToken)
  } catch (error) {
    console.log('error')
    console.log(error)
    res.status(401).json({ message: 'Unauthorized', error })
  }

}