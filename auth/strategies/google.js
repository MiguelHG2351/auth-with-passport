const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = function init(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: `${process.env["CALLBACK_URL"]}auth/google/callback`,
        passReqToCallback: true,
      },
      function verify(_, accessToken, refreshToken, profile, done) {
        console.log('google access and refresh token')
        console.log(accessToken)
        console.log(refreshToken)
        
        done(null, {
          name: profile.displayName,
          username: profile.email.split("@")[0],
          image: profile._json.picture,
          provider: profile.provider,
          email: profile.email,
          accessToken,
          refreshToken,
        });
      }
    )
  );
};

// https://www.googleapis.com/oauth2/v3/tokeninfo?
// https://oauth2.googleapis.com/tokeninfo

// module.exports = auth;
// ;Google
// profile.id
// profile.provider
// profile.email
// profile.photos[0].value
// not: profile.username but i'm using given_name.trim().replaceAll(' ', '').toLowerCase()

// Github
// profile.id
// profile.provider
// profile.email
// profile.username
// profile.photos[0].value
