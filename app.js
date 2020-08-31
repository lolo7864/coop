var createError = require("http-errors");
var express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var path = require("path");
var logger = require("morgan");
var methodOverride = require("method-override");
var flash = require("express-flash");
var fileUpload = require("express-fileupload");
//var cookieParser = require("cookie-parser");
const session = require("express-session");

var app = express();

var indexRouter = require("./routes/index");
//var adminRouter = require("./routes/admin");//TODO:DELETE
var companiesRouter = require("./routes/companies");
var usersRouter = require("./routes/users");

var mongoose = require("mongoose");
var mongoDB =
  "mongodb+srv://admin:T7HMsOr3CT2E4FTr@cluster0.ghjen.mongodb.net/coop?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(
  session({ secret: "SECRETTTT", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(flash());
//app.use(cookieParser("SECRETTTT"));
app.use(express.static(path.join(__dirname, "public")));

//===================== Setting Up Users starts Here=====================
const User = require("./models/user");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { msg: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
//===================== Setting Up Users end Here=====================

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
//app.use("/admin", adminRouter);TODO:DELETE
app.use("/users", usersRouter);
app.use("/companies", companiesRouter);

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
