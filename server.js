const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const { detect } = require("detect-browser");
require("dotenv").config();

const mongoDBInit = require("./database/mongo");
const routes = require("./router/index.routes");

const app = express();

mongoDBInit()
  .then(() => console.log("Database is connected"))
  .catch((err) => console.error(err));

app.use(logger("dev"));
app.use(cors());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("./auth/strategies/index")(passport);
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.get("/test", (req, res) => {
  res.json({
    data: {
      userAgent: req.headers["user-agent"],
      others: {
        ...detect(req.headers["user-agent"]),
        ip: req.socket.remoteAddress,
      },
    },
  });
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// #region testing
app.get("/testing", (req, res) => {
  const FIFTEEN_MINUTES_IN_MILLISECONDS = () =>
    new Date(Date.now() + 60 * 1000 * 15);

  const FIVE_DAYS_IN_MILLISECONDS = () =>
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);
  const ACCESS_TOKEN =
  const REFRESH_TOKEN =

  res.cookie("access_token", ACCESS_TOKEN, {
    httpOnly: true,
    secure: true,
    expires: FIFTEEN_MINUTES_IN_MILLISECONDS(),
  });
  res.cookie("refresh_token", REFRESH_TOKEN, {
    httpOnly: true,
    secure: true,
    expires: FIVE_DAYS_IN_MILLISECONDS(),
  });

  res.send("Hello world!");
});

app.get("/log_cookies", (req, res) => {
  console.log(req.cookies);
  console.log(req.cookies.refresh_token);

  res.send("Hello world!");
})

// #endregion

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    message: "Not found",
  });
});

module.exports = app;
