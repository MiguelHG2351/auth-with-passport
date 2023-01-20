const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const logger = require('morgan')
const path = require("path");
require("dotenv").config();

const mongoDBInit = require("./database/mongo");
const routes = require("./router/index.routes");

// if (process.env.NODE_ENV !== "production") {
// }

const app = express();

mongoDBInit();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

routes(app);

app.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = app;
