const GoogleStrategy = require("passport-google-oauth2").Strategy;
const UserServices = require("../../services/user.services");
const SessionServices = require("../../services/session.services");

const userServices = new UserServices();
const sessionServices = new SessionServices();

module.exports = function init(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: `${process.env["CALLBACK_URL"]}auth/google/callback`,
        passReqToCallback: true,
      },
      async function verify(req, accessToken, refreshToken, profile, done) {
        console.log("google access and refresh token");

        try {
          const name = profile.displayName;
          const username = profile.email.split("@")[0];
          const email = profile.email;
          const image = profile._json.picture;
          const provider = profile.provider;

          let getUser = await userServices.findUser(
            { username },
            { lean: true }
          );

          if (!getUser) {
            getUser = await userServices.createUser({
              username,
              name,
              email,
              image,
              provider,
            });
          }

          const {
            errorType,
            message,
            restrictedSession,
            accessToken: _accessToken,
            sid,
            refreshToken: _refreshToken,
          } = await sessionServices.createSession({
            accessToken,
            refreshToken,
            username,
          });

          if (errorType === "error-sessions") {
            return done(null, false, {
              message,
              restrictedSession,
            });
          }
          return done(null, {
            name: profile.displayName,
            username: profile.email.split("@")[0],
            image: profile._json.picture,
            provider: profile.provider,
            email: profile.email,
            accessToken,
            refreshToken,
            sid,
          });
        } catch (err) {
          return done(err);
        }
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
