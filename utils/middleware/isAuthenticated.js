module.exports = function isAuthenticated(req, res) {
  const accessToken = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token
}