const Router = require("express");
const router = Router();
const passport = require("passport");
const UserServices = require("../services/user.services");
const { createUserDto } = require("../dtos/user.dtos");
const { config } = require("../utils");
// const { badRequest } = require("../utils/errors");

const { signJWT } = require("../utils");
const validateSchema = require("../utils/middleware/validateSchema");
const userModel = new UserServices();

const FIFTEEN_MINUTES_IN_MILLISECONDS = () =>
  new Date(Date.now() + 60 * 1000 * 15);

const FIVE_DAYS_IN_MILLISECONDS = () =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);

const isDev = config.isDev;


router.get("/login", (req, res) => {
  res.send("Hello world");
});

// #region local
router.post("/local", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, options = {}) => {
    // Haber, si error no es nulo quiere decir que entro al catch de la funcion
    // Si user es nulo quiere decir que no encontro el usuario
    // Si options no es nulo quiere decir que ocurrio lo siguiente:
    // 1. El usuario no existe
    // 2. La contraseña es incorrecta
    // 3. El usuario tiene mas de 3 sesiones activas
    if (err) return res.json(err);
    
    if (!user && options.errorType !== "many-sessions") {
      return res.redirect(
        `/auth/error?message=${options.message}&errorType=${options.errorType}`
      );
    }

    const tokens = {
      accessToken: options.errorType === 'many-sessions' ? options.accessToken : user.accessToken,
      refreshToken: options.errorType === 'many-sessions' ? options.refreshToken : user.refreshToken,
    }

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: isDev,
      expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
    });
    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: isDev,
      expires: FIVE_DAYS_IN_MILLISECONDS(),
    });
    res.redirect("/client");
  })(req, res, next);
});

router.get("/error", (req, res) => {
  const { errorType, message, accessToken, refreshToken } = req.query;
  // if (errorType === "user-password" || errorType === "error-sessions") {
  //   // si el origen es /auth/error lee el error
  //   return res.redirect(`/auth/signIn?error=${message}`);
  // }
  // return res.redirect(`/auth/session?error=${message}`);
  res.json({ errorType, message, accessToken, refreshToken })
  // res.render('error', { message, errorType })
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
