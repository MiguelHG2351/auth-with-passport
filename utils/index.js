const jose = require("jose");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);
const alg = "HS256";

const signJWT = async (username, userId) => {
  if (!username || !userId) {
    return Promise.reject('username or userId is not defined')
  }

  try {
  
    const jwt = await new jose.SignJWT({
      username
    }).setProtectedHeader({ alg })
    .setSubject(userId)
    .setExpirationTime('15min')
    .setAudience('urn:chat-app:client')
    .setIssuer('urn:chat-app:issuer')
    .setIssuedAt()
    .sign(JWT_SECRET)
  
    return jwt
  } catch (err) {
    return Promise.reject(err)
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
    return Promise.reject(err)
  }
}

module.exports = {
  signJWT,
  verifyClientToken
}
