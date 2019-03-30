var express = require("express");
var accounts = express.Router();
var UserModel = require("../models/UserModel");
var passwordHash = require("../lib/passwordHash");

accounts.get("/", function(req, res) {
  res.send("account app");
});

accounts.get("/join", function(req, res) {
  res.render("accounts/join");
});

accounts.post("/join", function(req, res) {
  var User = new UserModel({
    username: req.body.username,
    password: passwordHash(req.body.password),
    displayname: req.body.displayname
  });

  User.save(function(err) {
    res.send(
      "<script>alert('회원가입성공'); location.href='/accounts/login'; </script>"
    );
  });
});

accounts.post("/login", function(req, res) {
  res.render("accounts/login");
});

module.exports = accounts;
