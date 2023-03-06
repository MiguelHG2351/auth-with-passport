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
              message: "Incorrect username or password.",
            });
          }
          console.log('Before compare password')
          console.log(typeof user.verifyPassword)
          if (!user.verifyPassword(password)) {
            console.log('inside compare password')
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log('After compare password')

          const beforeSessions = await Session.countDocuments({
            userId: user._id,
          });
          if (beforeSessions > 4) {
            console.log("Error1 is:");
            return done(null, false, {
              message:
                "You have many sessions, please logout from other devices",
            });
          }

          const session = await Session.create({
            isValid: true,
            userId: user._id,
            browser: device.type,
            os: device.os,
            version: device.version,
            ip: req.socket.remoteAddress,
          });
          return done(null, {
            accessToken: await user.generateAccessToken({
              username: user.username,
              userId: user.id,
            }),
            refreshToken: await user.generateRefreshToken({
              sessionId: session.id,
            }),
          });
        } catch (err) {
          console.log("Error is:");
          console.log(err);
          return done(err);
        }
      }
    )
  );
}

module.exports = init;
// test password: miguel2351_1234
