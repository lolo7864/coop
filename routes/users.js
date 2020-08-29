var express = require("express");
var router = express.Router();
var passport = require("passport");
var userController = require("../controllers/user");

/* GET users listing. */
//router.get("/", function (req, res, next) {
//  res.send("respond with a resource");
//});

router.get("/login", function (req, res, next) {
  res.render("login");
  delete req.locals.error;
});

router.get("/profile", function (req, res, next) {
  userController.getProfile(req, res, next);
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: "Invalid Username or Password",
  })
);

router.post("/signup", function (req, res, next) {
  userController.add(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
