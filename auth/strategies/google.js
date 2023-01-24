const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");

// passport.serializeUser(function(user, done) {
//   console.log('serializeUser user')
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   console.log('deserializeUser user')
//   done(null, user);
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: `${process.env["CALLBACK_URL"]}auth/google/callback`,
      passReqToCallback: true,
    },
    function verify(request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log('Google Strategies');
      done(null, {
        user: {
          username: profile._json.name,
          picture: profile._json,
          accessToken,
          refreshToken
        },
      });
    }
  )
);

// module.exports = auth;
