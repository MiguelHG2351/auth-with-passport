const Router = require("express");
const router = Router();
const passport = require("passport/");
require("../auth/strategies/google");

router.get(
  "/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
