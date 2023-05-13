const GoogleStrategy = require("passport-google-oauth2").Strategy;
const UserServices = require("../../services/user.services");
const { SessionServices } = require("../../services/session.services");
const AccountServices = require("../../services/account.services");
const { detect } = require("detect-browser");

const userServices = new UserServices();
const sessionServices = new SessionServices();
const accountServices = new AccountServices();

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
        const device = detect(req.headers["user-agent"]);
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
            });
            await accountServices.createAccount({
              provider,
              userId: getUser._id,
              accountState: "enable",
              accessToken,
              refreshToken
            })
          }

          console.log('Access: ' + accessToken)
          const {
            error: errorInfo,
            message,
            restrictedSession,
            accessToken: _accessToken,
            sid,
            refreshToken: _refreshToken,
          } = await sessionServices.createSession({
            accessToken,
            refreshToken,
            username,
            device: {
              ...device,
              ip: req.socket.remoteAddress
            },
          });
          console.log('Error Type ')
          console.log(errorInfo, message, restrictedSession, _accessToken, sid, _refreshToken)

          if (errorInfo) {
            return done(null, false, {
              errorInfo,
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
            accessToken: _accessToken,
            refreshToken: _refreshToken,
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
