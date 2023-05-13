const Router = require("express");
const router = Router();
const passport = require("passport");

// utils
const { config } = require("../utils");
const { setCookiesSession } = require("../utils/session");
const { generateErrorToken, decodeAccessToken, decodeRefreshToken, decodeErrorToken } = require("../utils/token");

const { ERROR_TYPE } = require("../services/session.services");

// const { badRequest } = require("../utils/errors");

// const { signJWT } = require("../utils");
// const validateSchema = require("../utils/middleware/validateSchema");

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
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, options = {}) => {
      // Haber, si error no es nulo quiere decir que entro al catch de la funcion
      // Si user es nulo quiere decir que no encontro el usuario
      // Si options no es nulo quiere decir que ocurrio lo siguiente:
      // 1. El usuario no existe
      // 2. La contraseña es incorrecta
      // 3. El usuario tiene mas de 3 sesiones activas
      if (err) return res.json(err);

      if (!user && options.errorType !== "many-sessions") {
        const errorToken = await generateErrorToken({
          errorType: "error-sessions",
          message:
            "El token de sesión no es válido, por favor inicia sesión nuevamente",
        });
        return res.redirect(`/auth/error?error=${errorToken}`);
      }

      const tokens = {
        accessToken:
          options.errorInfo?.errorType === ERROR_TYPE.MAXIMUN_SESSIONS
            ? options.accessToken
            : user.accessToken,
        refreshToken:
          options.errorInfo?.errorType === ERROR_TYPE.MAXIMUN_SESSIONS
            ? options.refreshToken
            : user.refreshToken,
      };

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
    }
  )(req, res, next);
});


router.get("/local", (req, res) => {
  res.render("login");
});
// #endregion

router.get("/error", async (req, res) => {
  const { error } = req.query;
  try {
    const info = await decodeErrorToken(error);
    res.json({ ...info });
  } catch (error) {
    res.json({ error: "The error info error has expired or is invalid" });
  }
});

// #region google
router.get("/google", async (req, res, next) => {
  const { refresh_token, access_token } = req.cookies;

  if (refresh_token || access_token) {
    try {
      const accessToken = await decodeAccessToken(refresh_token)
      const refreshToken = await decodeRefreshToken(access_token)
      console.log(`/auth/google try ${accessToken} ${refreshToken}`)
      return res.render("error_already_login");
    } catch (err) {
      console.log('/auth/google catch ')
      console.log(err)
    }
  }

  passport.authenticate("google", {
    scope: ["email", "profile"],
    accessType: "offline",
    failureMessage: true,
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      // failureRedirect: "/auth/google",
      // successRedirect: "/auth/google/success",
      session: false,
    },
    async (err, user, options = {}) => {
      console.log("before TODO");
      console.log(err);
      console.log(user);
      console.log(options);
      if (options.errorInfo?.errorType === "maximun-sessions") {
        const errorToken = await generateErrorToken({
          errorType: "many-sessions",
          message:
            "Tienes más de 4 sesiones activas, por favor cierra alguna sesión para poder iniciar sesión nuevamente",
        });
        return res.redirect(`/auth/error?error=${errorToken}`);
      }
      // set cookies and session to the database
      console.log(user.accessToken, user.refreshToken);
      setCookiesSession({
        res,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        sid: user.sid,
      });

      res.redirect("/client");
    }
  )(req, res, next);
});
/* #endregion */

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
//   res.json({
//     hello: "World",
//   });
// });

router.get("/logout", (req, res, next) => {
  // eliminar las sessiones del usuario en la base de datos
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/auth/login");
  });
});

module.exports = router;

// User -> account
// User -> Sessions

// Buscar la cookie con el access token
// Agregar el campo refresh token a la session
