const SessionModel = require("../database/models/Session");
const UserModel = require("../database/models/User");
const crypto = require("crypto");
// import CUID
class SessionServices {
  async createSession({ username, accessToken, refreshToken }) {
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return {
          errorType: "user-password",
          message: "Incorrect username or password.",
        };
      }

      if (!user.verifyPassword(password) && user.provider === 'local') {
        return {
          errorType: "user-password",
          message: "Incorrect username or password.",
        };
      }

      const beforeSessions = await SessionModel.countDocuments({
        userId: user._id,
      });
      if (beforeSessions >= 5) {
        return {
          errorType: "error-sessions",
          message:
            "You have 4 sessions more 1 session from this device, please logout from other devices or if the problem persists contact the administrator",
        };
      }

      let data = {
        restrictedSession: false,
      }
      const session = new SessionModel({
        latestAccess: Date.now(),
        userId: user._id,
        browser: device.type,
        os: device.os,
        version: device.version,
        ip: req.socket.remoteAddress,
      });

      if (beforeSessions === 4) {
        // session.
        data = {
          ...data,
          errorType: "many-sessions",
          message: "You have many sessions, please logout from other devices",
          restrictedSession: true,
        }
      }

      if (user.provider !== "local") {
        const _accessToken = generateCryptoToken(accessToken)
        const _refreshToken = generateCryptoToken(refreshToken)

        session.token = _refreshToken
        await session.save()
        return {
          ...data,
          accessToken: _accessToken.split(':')[0],
          sid: _accessToken.split(':')[1],
          refreshToken: _refreshToken,
        };
      }

      await session.save()
      return {
        ...data,
        accessToken: await user.generateAccessToken({
          userId: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        }),
        refreshToken: await user.generateRefreshToken({
          sessionId: session.id,
        }),
        sid: crypto.randomBytes(16),
      };
    } catch (err) {
      return err
    }
  }
}

// Esto sera unicamente para los procesos OAuth 2.0
function generateCryptoToken(refresh_token, iv = crypto.randomBytes(16)) {
  // Clave secreta compartida (debe ser generada y almacenada de forma segura)
  const SECRET_KEY = process.env.CRYPTO_SECRET;
  // Vector de inicialización (IV) aleatorio
  // const iv = crypto.randomBytes(16);
  console.log(iv.length);

  const cipher = crypto.createCipheriv("aes-128-cbc", SECRET_KEY, iv);
  // Encriptar el access token utilizando el objeto de cifrado
  let encrypted = cipher.update(refresh_token, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted + ":" + iv.toString("hex");
}

function decodeCryptoToken(token, iv) {
  const SECRET_KEY = process.env.CRYPTO_SECRET;

  // Crear un objeto de descifrado con el algoritmo AES-256-CBC, la clave secreta y el IV
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    SECRET_KEY,
    Buffer.from(iv, "hex")
  );

  // Descifrar el access token utilizando el objeto de descifrado
  let decrypted = decipher.update(token, "hex", "utf8");
  decrypted += decipher.final("utf8");

  // Imprimir el access token descifrado
  console.log("Access token descifrado:", decrypted);
}

module.exports = SessionServices;
