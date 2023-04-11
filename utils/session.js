const { config } = require("./index");

const isDev = config.isDev;

const FIFTEEN_MINUTES_IN_MILLISECONDS = () =>
  new Date(Date.now() + 60 * 1000 * 15);

const FIVE_DAYS_IN_MILLISECONDS = () =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);

const setCookiesSession = ({
  res, refreshToken, accessToken, sid
}) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isDev,
    expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isDev,
    expires: FIVE_DAYS_IN_MILLISECONDS(),
  });
  res.cookie("sid", sid, {
    httpOnly: true,
    secure: isDev,
    expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
  });
}

module.exports = {
  setCookiesSession,
}
