const passport = require("passport");
const GitHubStrategy = require("passport-github2");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env["CALLBACK_URL"]}auth/github/callback`,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile);
      console.log(profile)
      console.log(accessToken)
      console.log(refreshToken)
      done(null, profile._json);
    }
  )
);
