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

  if (!refreshToken) {
    return res
      .status(401)
      .json({
        message:
          "Unauthorized you need an access token or valid refresh token for access to this information",
      });
  }
  console.log("Tokens");
  console.log(accessToken);
  console.log(refreshToken);
  // try descode token
  try {
    const sessionToken = (await decodeRefreshToken(refreshToken)).payload;
    console.log("decode tokens");
    console.log(sessionToken);
    console.log(accessToken);

    if (!accessToken) {
      const userSession = await Session.findById(sessionToken.sessionId)
        .populate("userId")
        .lean();

      console.log("find user session");
      console.log(userSession.userId);
      if (!accessToken) {
        console.log("New access token");
        const userInfo = userSession.userId;
        const newToken = await generateAccessToken({
          name: userInfo.name,
          email: userInfo.email,
          username: userInfo.username,
          userId: userInfo._id,
        });
        console.log("New access token xd");
        res.cookie("access_token", newToken, {
          httpOnly: true,
          secure: isDev,
          expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
        });
        return res.redirect("/client");
      }
      return res.status(401).json({ message: "Unauthorized" });
      // check refesh token
    }
    const userToken = await decodeAccessToken(accessToken);
    console.log(userToken);
    res.render("home");
  } catch (error) {
    console.log("error");
    // error has fields: message, name, code
    console.log(error);
    res.status(401).json({ message: `Unauthorized ${error.message}` });
  }
};
