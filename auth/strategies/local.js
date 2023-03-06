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
          const beforeSessions = await Session.countDocuments({
            userId: user._id,
          });

          if (beforeSessions > 4) {
            console.log("Error1 is:");
            return done(null, false, {
              description:
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

          if (!user) {
            return done({ error: "xd1" }, false, {
              description: "Incorrect username or password.",
            });
          }
          if (!user.verifyPassword(password)) {
            return done({ error: "xd2" }, false, {
              description: "Incorrect username or password.",
            });
          }
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
          return done(err, false, {
            description: "Something went wrong, please try again later",
          });
        }
      }
    )
  );
}

module.exports = init;
// test password: miguel2351_1234
