const Router = require("express");
const router = Router();
const passport = require("passport");
const UserServices = require("../services/user.services");
const { createUserDto } = require("../dtos/user.dtos");
// const { badRequest } = require("../utils/errors");

const { signJWT } = require("../utils");
const validateSchema = require("../utils/middleware/validateSchema");

const userModel = new UserServices();
const FIFTEEN_MINUTES_IN_MILLISECONDS = () =>
  new Date(Date.now() + 60 * 1000 * 15);

router.get("/login", (req, res) => {
  res.send("Hello world");
});

// #region local
router.post(
  "/local",
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/auth/error",
    failureMessage: true
  }),
  // validateSchema(createUserDto, "user"),
  (req, res) => {
    res.cookie("access_token", req.user.accessToken);
    res.cookie("refresh_token", req.user.refreshToken);
    res.redirect("/client");
  }
);

router.get("/error", (req, res, next) => {
  passport.authenticate("local", function (err, ...data) {
    console.log(err, data)
    if(err) {
      res.json({
        user: 'Error too many sessions'
      });
      return 
    }
    res.json({
      data
    });
  })(req, res, next);
});

router.get("/local", (req, res) => {
  res.render("login");
});
// #endregion

// #region google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
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
    try {
      const { username, name, email, image, provider } = req.user;
      let getUser = await userModel.findUser({ username }, { lean: true });
      if (!getUser) {
        getUser = await userModel.createUser({
          username,
          name,
          email,
          image,
          provider,
        });
      }

      const generateToken = await signJWT(username, getUser._id);

      res.cookie("token_auth", generateToken, {
        httpOnly: true,
        expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
        secure: true,
      });
      res.redirect("/client");
    } catch (err) {
      console.error(err);
      res.redirect("/client");
    }
  }
);
// #endregion

// #region github
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/github",
    profileFields: ["email"],
    session: false,
  }),
  (req, res) => {
    // console.log(req.user);
    res.redirect("/client");
  }
);

router.get("/github/success", (req, res) => {
  res.json({
    hello: "World",
  });
});
// #endregion

// Esta ruta puede ser una donde ingresen los campos faltantes
// que google, facebook u otro proveedor no proporciona :D
// router.get("/google/success", (req, res) => {
//   console.log(req.user);
//   res.json({
//     hello: "World",
//   });
// });

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/auth/login");
  });
});

module.exports = router;
