const jose = require("jose");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);
const JWT_REFRESH_TOKEN = new TextEncoder().encode(
  process.env.JWT_REFRESH_TOKEN
);
const JWT_ERROR_TOKEN = new TextEncoder().encode(
  process.env.JWT_ERROR_TOKEN
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
  restrictedSession = false,
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
      .setExpirationTime("16min")
      .setAudience("urn:chat-app:client")
      .setIssuer("urn:chat-app:issuer")
      .setIssuedAt()
      .sign(JWT_SECRET);

    return jwt;
  } catch (err) {
    return Promise.reject(err);
  }
};

async function decodeAccessToken(token) {
  try {
    const decoded = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: "urn:chat-app:issuer",
      audience: "urn:chat-app:client",
    });
    return decoded;
  } catch (err) {
    return Promise.reject(err);
  }
}

const generateRefreshToken = async ({ sessionId }) => {
  if (!sessionId) {
    return Promise.reject("sessionId is not defined");
  }

  try {
    const jwt = await new jose.SignJWT({
      sessionId,
    })
      .setProtectedHeader({ ...JWT_HEADER })
      .setExpirationTime("6days")
      .setAudience("urn:chat-app:client")
      .setIssuer("urn:chat-app:issuer")
      .setIssuedAt()
      .sign(JWT_REFRESH_TOKEN);

    return jwt;
  } catch (err) {
    return Promise.reject(err);
  }
};

async function decodeRefreshToken(token) {
  try {
    const decoded = await jose.jwtVerify(token, JWT_REFRESH_TOKEN, {
      issuer: "urn:chat-app:issuer",
      audience: "urn:chat-app:client",
    });
    return decoded;
  } catch (err) {
    return Promise.reject(err);
  }
}

const generateErrorToken = async ({ errorType, message }) => {
  if (!errorType || !message) {
    return Promise.reject("sessionId is not defined");
  }

  try {
    const jwt = await new jose.SignJWT({
      errorType, message,
    })
      .setProtectedHeader({ ...JWT_HEADER })
      .setExpirationTime("1min")
      .setAudience("urn:chat-app:client")
      .setIssuer("urn:chat-app:issuer")
      .setIssuedAt()
      .sign(JWT_ERROR_TOKEN);

    return jwt;
  } catch (err) {
    return Promise.reject(err);
  }
};

async function decodeErrorToken(token) {
  try {
    const decoded = await jose.jwtVerify(token, JWT_ERROR_TOKEN, {
      issuer: "urn:chat-app:issuer",
      audience: "urn:chat-app:client",
    });
    return decoded;
  } catch (err) {
    return Promise.reject(err);
  }
}


module.exports = {
  generateAccessToken,
  decodeAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
  generateErrorToken,
  decodeErrorToken,
};
