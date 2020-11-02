var jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
  try {
    var token = req.headers.token;
    var decode = jwt.verify(token,"techapi13");
    console.log(decode);
    next();
  } catch (err) {
    res.status(401).json({
      message:"Auth Fail"
    })
  }
}