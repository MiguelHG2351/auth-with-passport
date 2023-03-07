// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { detect } = require("detect-browser");
const User = require("../../database/models/User");
const Session = require("../../database/models/Session");

function init(passport) {
  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        const device = detect(req.headers["user-agent"]);
        // meanwhile, we can use this to create a user
        req.body.provider = "local";
        req.body.image =
          "https://lh3.googleusercontent.com/a/AGNmyxaH-rRsGEGXYWIfxTfxhFAovianDmCYUxoZCLxNaA=s96-c";

        try {
          const user = await User.findOne({ username: username });
          if (!user) {
            return done(null, false, {
              errorType: "user-password",
              message: "Incorrect username or password.",
            });
          }

          if (!user.verifyPassword(password)) {
            return done(null, false, {
              errorType: "user-password",
              message: "Incorrect username or password.",
            });
          }

          const beforeSessions = await Session.countDocuments({
            userId: user._id,
          });
          if (beforeSessions >= 5) {
            return done(null, false, {
              errorType: "error-sessions",
              message:
                "You have 4 sessions more 1 session from this device, please logout from other devices or if the problem persists contact the administrator",
            });
          }

          const session = await Session.create({
            latestAccess: Date.now(),
            userId: user._id,
            browser: device.type,
            os: device.os,
            version: device.version,
            ip: req.socket.remoteAddress,
          });
          if (beforeSessions === 4) {
            return done(null, false, {
              errorType: "many-sessions",
              message:
                "You have many sessions, please logout from other devices",
              accessToken: await user.generateAccessToken({
                userId: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                restrictedSession: true,
              }),
              refreshToken: await user.generateRefreshToken({
                sessionId: session.id,
              }),
            });
          }

          return done(null, {
            accessToken: await user.generateAccessToken({
              userId: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              restrictedSession: false,
            }),
            refreshToken: await user.generateRefreshToken({
              sessionId: session.id,
            }),
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

module.exports = init;
// test password: miguel2351_1234
