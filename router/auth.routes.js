const Router = require("express");
const router = Router();
const passport = require("passport");
require("../auth/strategies/google");

router.get("/login", (req, res) => {
  res.send("Hello world");
});

// router.get("/login/google", passport.authenticate("google"), (req, res) => {
//   res.redirect("/auth/verify");
// });

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
  })
);

router.get("/google/success", (req, res) => {
  console.log(req.session)
  res.json({
    hello: "World",
  });
});

module.exports = router;
