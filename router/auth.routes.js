const Router = require("express");
const router = Router();
const passport = require("passport");
const UserServices = require("../services/user.services");
const { createUserDto } = require("../dtos/user.dtos");
const { badRequest } = require("../utils/errors");

const { signJWT } = require("../utils");
const validateSchema = require("../utils/middleware/validateSchema");

require("../auth/strategies/index");

const userModel = new UserServices();
const FIFTEEN_MINUTES_IN_MILLISECONDS = () => new Date(Date.now() + (60*1000*15));

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
    failureRedirect: "/auth/google",
    session: false,
  }),
  validateSchema(createUserDto, "user"),
  async (req, res) => {
    const { username, name, email, image } = req.user;
    let getUser = await userModel.findUser({ username })
    // TODO: Make this :D user exist in database
    console.log(getUser)
    if (!getUser) {
      getUser = await userModel.createUser({
          username,
          name,
          email,
          image,
      });
    }
      console.log(user);

      const generateToken = await signJWT(username, user.id);

      res.cookie("token_auth", generateToken, {
        httpOnly: true,
        expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
        secure: true
      });
      console.log(req.user);
      res.redirect("/");
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/github",
    profileFields: ["email"],
    session: false,
  }),
  (req, res) => {
    console.log("user");
    // console.log(req.user);
    res.redirect("/cleint");
  }
);

// Esta ruta puede ser una donde ingresen los campos faltantes
// que google, facebook u otro proveedor no proporciona :D
// router.get("/google/success", (req, res) => {
//   console.log(req.user);
//   res.json({
//     hello: "World",
//   });
// });

router.get("/github/success", (req, res) => {
  // console.log("Session::::");
  // console.log(req.session.passport);
  res.json({
    hello: "World",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/auth/login");
  });
});

module.exports = router;
