const jose = require("jose");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);
const JWT_REFRESH_TOKEN = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN);
const JWT_HEADER = {
  alg: "HS256",
  typ: "JWT",
}

const generateAccessToken = async ({ username, userId }) => {
  console.log(`${username}, ${userId}`)
  if (!username || !userId) {
    return Promise.reject("username or userId is not defined");
  }

  try {
    const jwt = await new jose.SignJWT({
      username,
    })
      .setProtectedHeader({ ...JWT_HEADER })
      .setSubject(userId)
      .setExpirationTime("15min")
      .setAudience("urn:chat-app:client")
      .setIssuer("urn:chat-app:issuer")
      .setIssuedAt()
      .sign(JWT_SECRET);

    return jwt;
  } catch (err) {
    return Promise.reject(err);
  }
};

const generateRefreshToken = async ({ sessionId }) => {
  if (!sessionId) {
    return Promise.reject("sessionId is not defined");
  }

  try {
    const jwt = await new jose.SignJWT({
      sessionId,
      // name: device.userAgent,
      // version: device.version,
      // os: device.os,
      // type: device.type,
      // ip: device.ip,
    })
      .setProtectedHeader({ ...JWT_HEADER })
      .setExpirationTime("5days")
      .setAudience("urn:chat-app:client")
      .setIssuer("urn:chat-app:issuer")
      .setIssuedAt()
      .sign(JWT_REFRESH_TOKEN);

    return jwt;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  generateRefreshToken,
  generateAccessToken,
}
