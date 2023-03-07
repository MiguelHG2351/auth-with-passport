const jose = require("jose");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);
const JWT_REFRESH_TOKEN = new TextEncoder().encode(
  process.env.JWT_REFRESH_TOKEN
);
const JWT_HEADER = {
  alg: "HS256",
  typ: "JWT",
};

const generateAccessToken = async ({
  userId,
  username,
  name,
  email,
  restrictedSession,
}) => {
  if (!username) {
    return Promise.reject("username or userId is not defined");
  }

  try {
    const jwt = await new jose.SignJWT({
      username,
      name,
      email,
      restrictedSession,
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
};
