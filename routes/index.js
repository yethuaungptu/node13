var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Admin = require("../model/Admin");
var validator = require("email-validator");
var passwordValidator = require("password-validator");
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Tech House Studio" });
});

router.get("/home", function (req, res) {
  res.render("home", { name: "Home Page" });
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.post("/signup", function (req, res) {
  var admin = new Admin();
  admin.name = req.body.name;
  admin.email = req.body.email;
  admin.password = req.body.password;
  admin.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/signin");
  });
});

router.get("/signin", function (req, res) {
  res.render("signin");
});

router.post("/signin", function (req, res) {
  Admin.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && Admin.compare(req.body.password, rtn.password)) {
      req.session.user = { name: rtn.name, email: rtn.email, id: rtn._id };
      res.redirect("/");
    } else {
      res.redirect("/signin");
    }
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/");
  });
});

router.post("/emaildu", function (req, res) {
  Admin.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null || !validator.validate(req.body.email)) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  });
});

router.post("/passVal", function (req, res) {
  res.json({ status: schema.validate(req.body.password) });
});

module.exports = router;
