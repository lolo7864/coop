const User = require("../models/user");
const Company = require("../models/company");

function add(req, res, next) {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  user.save((err) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
}
function getProfile(req, res, next) {
  Company.find({}, (err, companies) => {
    if (err) return next(err);
    res.render("profile", { companies });
  });
}

module.exports = {
  add,
  getProfile,
};
