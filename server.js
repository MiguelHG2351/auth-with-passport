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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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

module.exports = app;
