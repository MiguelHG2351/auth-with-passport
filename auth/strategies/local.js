const passport = require("passport");
const LocalStrategy = require("passport-local");
const { detect } = require("detect-browser");
const User = require("../../database/models/User");
const Session = require('../../database/models/Session')

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

      const user = await User.findOne({ username });
      console.log(user.username)
      const session = await Session.create({
        isValid: true,
        userId: user._id,
        browser: device.type,
        os: device.os,
        version: device.version,
        ip: req.socket.remoteAddress,
      })
      console.log('Session: ' + session.id)

      try {
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, {
          ...user,
          accessToken: await user.generateAccessToken({
            username: user.username,
            userId: user.id,
          }),
          refreshToken: await user.generateRefreshToken({ sessionId: session.id }),
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// test password: miguel2351_1234
