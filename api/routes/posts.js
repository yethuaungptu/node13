var express = require("express");
var router = express.Router();
var Post = require("../../model/Post");
var checkAuth = require("../middleware/check-auth");

router.get("/",checkAuth, function (req, res) {
  Post.find({})
    .populate("author")
    .exec(function (err, rtn) {
      if (err) {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      } else {
        res.status(200).json({
          posts: rtn,
        });
      }
    });
});

router.get("/:id",checkAuth, function (req, res) {
  Post.findById(req.params.id)
    .populate("author")
    .exec(function (err, rtn) {
      if (err) {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      } else {
        res.status(200).json({
          post: rtn,
        });
      }
    });
});

router.post("/",checkAuth, function (req, res) {
  var post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.body.author;

  post.save(function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(201).json({
        message: "Post add success",
        post: rtn,
      });
    }
  });
});

router.patch("/:id",checkAuth, function (req, res) {
  var updateOps = {};
  for (var opt of req.body) {
    updateOps[opt.proName] = opt.proValue;
  }
  Post.findByIdAndUpdate(req.params.id, { $set: updateOps }, function (
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
        message: "Post update success",
      });
    }
  });
});

router.delete("/:id",checkAuth, function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "Post delete success",
      });
    }
  });
});

module.exports = router;
