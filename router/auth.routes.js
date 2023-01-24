const Router = require("express");
const router = Router();
const passport = require("passport");
require("../auth/strategies/index");

router.get("/login", (req, res) => {
  res.send("Hello world");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/auth/github/success",
    session: false
  })
);

router.get("/google/success", (req, res) => {
  console.log(req.session)
  console.log(req.user)
  res.json({
    hello: "World",
  });
});

router.get("/github/success", (req, res) => {
  console.log('Session::::')
  console.log(req.session.passport)
  res.json({
    hello: "World",
  });
});

router.get(
  "/logout",
  (req, res, next) => {
    req.logout((err) => {
      if(err) return next(err)
      res.redirect('/auth/login')
    })
  }
);

module.exports = router;
