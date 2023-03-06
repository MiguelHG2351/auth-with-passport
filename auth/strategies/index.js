// const passport = require("passport");
// passport.serializeUser(function (user, done) {
//   console.log("serializeUser user");
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   console.log("deserializeUser user");
//   done(null, user);
// });

module.exports = function init(passport) {
  require("./google")(passport);
  require("./github")(passport);
  require("./local")(passport);
}
