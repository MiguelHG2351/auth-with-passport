module.exports = function init(passport) {
  require("./google")(passport);
  require("./github")(passport);
  require("./local")(passport);
}
