var express = require("express");
var router = express.Router();
var User = require("../model/User");
var bcrypt = require("bcryptjs");
var multer = require('multer');
var upload = multer({dest:"public/images/uploads"})

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/useradd", function (req, res) {
  res.render("users/user-add");
});

router.post("/useradd",upload.single('photo'), function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  if(req.file) user.imgUrl = "/images/uploads/"+ req.file.filename;
  user.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/users/userlist");
  });
});

router.get("/userlist", function (req, res) {
  User.find(function (err, rtn) {
    if (err) throw err;
    res.render("users/user-list", { users: rtn });
  });
});

router.get("/userdetail/:uid", function (req, res) {
  User.findById(req.params.uid, function (err, rtn) {
    if (err) throw err;
    res.render("users/user-detail", { user: rtn });
  });
});

router.get("/userupdate/:id", function (req, res) {
  User.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("users/user-update", { user: rtn });
  });
});

router.post("/userupdate",upload.single('photo'), function (req, res) {
  var update = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
  };
  if(req.file) update.imgUrl = "/images/uploads/"+ req.file.filename;
  User.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) throw err;
    res.redirect("/users/userlist");
  });
});

router.get("/userdelete/:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.redirect("/users/userlist");
  });
});

router.post("/emaildu", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  });
});

module.exports = router;
