const Session = require("../../database/models/Session");
const {
  decodeAccessToken,
  decodeRefreshToken,
  generateAccessToken,
} = require("../token");
const { config } = require("../../utils");

const FIFTEEN_MINUTES_IN_MILLISECONDS = () =>
  new Date(Date.now() + 60 * 1000 * 15);

const isDev = config.isDev;

module.exports = async function isAuthenticated(req, res) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken) {
    // decode refresh token
    try {
      // de aquí obtenemos un error porque
      // el token no es válido o ha expirado
      const sessionToken = (await decodeRefreshToken(refreshToken)).payload;
      const userSession = await Session.findById(sessionToken.sessionId)
        .populate("userId")
        .lean();

      const userInfo = userSession.userId;

      if (!userSession) {
        return res.status(401).json({
          message: "Unauthorized session not found",
        });
      }

      const newToken = await generateAccessToken({
        name: userInfo.name,
        email: userInfo.email,
        username: userInfo.username,
        userId: userInfo._id,
      });
      res.cookie("access_token", newToken, {
        httpOnly: true,
        secure: isDev,
        expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
      });
      return next();
    } catch (error) {
      console.log("This is reason");
      console.log(error);
      // error has fields: message, name, code
      if (error.code === "ERR_JWT_EXPIRED") {
        // remove session of database
        let buff = Buffer.from(refreshToken.split(".")[1], 'base64')
        const payload = JSON.parse(buff.toString('ascii'));
        await Session.findByIdAndDelete(payload.sessionId)
        
        return res.redirect(`/auth/error?errorType=error-sessions&message=La sesión ha expirado, por favor inicia sesión nuevamente`)
      }
      return res
        .status(401)
        .json({
          message: `Unauthorized decode:${error?.message ?? error?.reason}`,
        });
    }
  }
  // try descode token
  try {
    // check access token
    const userToken = (await decodeAccessToken(accessToken)).payload;
    console.log('All god')
    console.log(userToken)
    return next()
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: `Unauthorized ${error.message} please try login again`,
    });
  }
    // return res.status(401).json({
    //   message:
    //     "Unauthorized you need an access token or valid refresh token for access to this information",
    // });
};
