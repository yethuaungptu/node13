var express = require("express");
var router = express.Router();
var User = require("../../model/User");
var bcrypt = require("bcryptjs");
var checkAuth = require("../middleware/check-auth");

router.get("/list",checkAuth, function (req, res) {
  User.find(function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        users: rtn,
      });
    }
  });
});

router.get("/detail/:id",checkAuth, function (req, res) {
  User.findById(req.params.id, function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        user: rtn,
      });
    }
  });
});

router.post("/add",checkAuth, function (req, res) {
  User.findOne({ email: req.body.email }, function (err2, rtn2) {
    if (err2) {
      res.status(500).json({
        message: "Internal server error",
        error: err2,
      });
    } else {
      if (rtn2 != null) {
        res.status(409).json({
          message: "Email duplicated",
          email: rtn2.email,
        });
      } else {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function (err, rtn) {
          if (err) {
            res.status(500).json({
              message: "Internal server error",
              error: err,
            });
          } else {
            res.status(201).json({
              message: "User account create success",
              user: rtn,
            });
          }
        });
      }
    }
  });
});

router.patch("/update/:id",checkAuth, function (req, res) {
  var updateOps = {};
  for (var opt of req.body) {
    updateOps[opt.proName] =
      opt.proName == "password"
        ? bcrypt.hashSync(opt.proValue, bcrypt.genSaltSync(8), null)
        : opt.proValue;
  }
  User.findByIdAndUpdate(req.params.id, { $set: updateOps }, function (
    err,
    rtn
  ) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "User account update success",
      });
    }
  });
});

router.delete("/delete/:id",checkAuth, function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "User account delete success",
      });
    }
  });
});

module.exports = router;
