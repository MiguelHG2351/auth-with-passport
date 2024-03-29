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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pZ3VlbGNyYWZ0cGUwIiwibmFtZSI6Ik1pZ3VlbCBIZXJuw6FuZGV6IEdhaXRhbiIsImVtYWlsIjoibWlndWVsY3JhZnRwZTBAZ21haWwuY29tIiwicmVzdHJpY3RlZFNlc3Npb24iOmZhbHNlLCJzdWIiOiI2NDE0YTZiYmEwZjM1ZjQ5OTFmMjA4ODUiLCJleHAiOjE2ODA5MDU3ODIsImF1ZCI6InVybjpjaGF0LWFwcDpjbGllbnQiLCJpc3MiOiJ1cm46Y2hhdC1hcHA6aXNzdWVyIiwiaWF0IjoxNjgwOTA0ODIyfQ.PLt2AL1V17LNA7KuMd6TMa46V4x49l--O2k5iMUpQME";
  const REFRESH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NDMwOTA1YTBkNWQ5MTQ5MjlhZDdlYzkiLCJleHAiOjE2ODE0MjMyMjIsImF1ZCI6InVybjpjaGF0LWFwcDpjbGllbnQiLCJpc3MiOiJ1cm46Y2hhdC1hcHA6aXNzdWVyIiwiaWF0IjoxNjgwOTA0ODIyfQ.R50ExqsByBgVYRKDL0en7yhqOd5U9NHmRey7KNnqBmE";

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
