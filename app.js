var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");

var apiUsersRouter = require("./api/routes/users");
var apiPostsRouter = require("./api/routes/posts");
var apiAdminsRouter = require("./api/routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "Node13@#$@SSion12", //any string
    resave: false,
    saveUninitialized: true,
  })
);

// mongoose.connect("mongodb://127.0.0.1/node13db");
mongoose.connect("mongodb+srv://yethu:yethu123@node13.prxxu.mongodb.net/node13?retryWrites=true&w=majority")
var db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "MongoDB connection error from node 13!!!")
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use("/api/users", apiUsersRouter);
app.use("/api/posts", apiPostsRouter);
app.use("/api", apiAdminsRouter);
app.use("/", indexRouter);
app.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/signin");
  }
});
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
