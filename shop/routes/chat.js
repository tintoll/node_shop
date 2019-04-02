var express = require("express");
var chatRouter = express.Router();

chatRouter.get("/", function(req, res) {
  if (!req.isAuthenticated()) {
    res.send(`<script>alert('로그인이 필요한 서비스입니다.');</script>`);
  } else {
    res.render("chat/index");
  }
});

module.exports = chatRouter;
