const jose = require("jose");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);
const alg = "HS256";

const signJWT = async (username, userId) => {
  if (!username || !userId) {
    throw new Error('username or userId is not defined')
  }

  try {
  
    const jwt = await new jose.SignJWT({
      username
    }).setProtectedHeader({ alg })
    .setSubject(userId)
    .setExpirationTime('15min')
    .setAudience('urn:chat-app:client')
    .setIssuer('urn:platzi:issuer')
    .setIssuedAt()
    .sign(JWT_SECRET)
  
    return jwt
  } catch (err) {
    Promise.reject(err)
  }
};

const verifyClientToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'urn:chat-app:client',
      audience: 'urn:platzi:issuer'
    })
    return Promise.resolve(payload)
  } catch (err) {
    Promise.reject(err)
  }
}

module.exports = {
  signJWT,
  verifyClientToken
}
