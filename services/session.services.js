const SessionModel = require("../database/models/Session");
const UserModel = require("../database/models/User");
const crypto = require("crypto");
// import CUID

const ERROR_TYPE = {
  MANY_SESSIONS: "many-sessions",
  MAXIMUN_SESSIONS: "maximun-sessions",
  USER_PASSWORD: "user-password",
  ERROR_SESSION: "error-sessions",
  EXPIRED_SESSION: "expired-sessions",
};

class SessionServices {
  async createSession({ username, device }) {
    console.log('here')
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return {
          error: {
            message: "Incorrect username or password.",
            errorType: ERROR_TYPE.USER_PASSWORD,
          }
        };
      }

      // if (!user.verifyPassword(password) && user.provider === 'local') {
      //   return {
      //     error: {
      //       errorType: "user-password",
      //       message: "Incorrect username or password.",
      //     }
      //   };
      // }

      const beforeSessions = await SessionModel.countDocuments({
        userId: user._id,
      });
      console.log('Cantidad de sesiones: ', beforeSessions)
      if (beforeSessions >= 5) {
        return {
          error: {
            errorType: ERROR_TYPE.MAXIMUN_SESSIONS,
            message:
              "You have 4 sessions more 1 session from this device, please logout from other devices or if the problem persists contact the administrator",
          }
        };
      }

      let data = {
        error: null,
        restrictedSession: false,
      }
      const session = new SessionModel({
        latestAccess: Date.now(),
        userId: user._id,
        browser: device.type,
        os: device.os,
        version: device.version,
        ip: device.ip,
      });

      if (beforeSessions === 4) {
        // session.
        console.log('imposible D:')
        data = {
          ...data,
          error: {
            errorType: ERROR_TYPE.MAXIMUN_SESSIONS,
            message: "You have many sessions, please logout from other devices",
          },
          restrictedSession: true,
        }
      }

      await session.save()
      console.log('before done')
      console.log(data)
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
        sid: crypto.randomBytes(16).toString("hex"),
      };
    } catch (err) {
      console.log('Error is ' + err)
      return err
    }
  }
}

module.exports = {
  SessionServices,
  ERROR_TYPE
};
