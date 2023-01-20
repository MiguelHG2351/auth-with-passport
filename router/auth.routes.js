const Router = require("express");
const router = Router();
const passport = require("passport");
require("../auth/strategies/google");

router.get("/login", (req, res) => {
  res.send("Hello world");
});

router.get("/login/google", passport.authenticate("google"), (req, res) => {
  res.send("Hello world");
});

module.exports = router;
