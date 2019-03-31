var express = require("express");
var accounts = express.Router();
var UserModel = require("../models/UserModel");
var passwordHash = require("../lib/passwordHash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// passport 정책 선언
passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  var result = user;
  result.password = "";
  console.log("deserializeUser");
  done(null, result);
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, username, password, done) {
      UserModel.findOne(
        { username: username, password: passwordHash(password) },
        function(err, user) {
          if (!user) {
            return done(null, false, { message: "아이디 또는 비밀번호 오류" });
          } else {
            return done(null, user);
          }
        }
      );
    }
  )
);

// Router
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

accounts.get("/login", function(req, res) {
  res.render("accounts/login", { flashMessage: req.flash().error });
});
accounts.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/accounts/login",
    failureFlash: true
  }),
  function(req, res) {
    res.send(
      '<script>alert("로그인성공");location.href="/accounts/success";</script>'
    );
  }
);
// 성공시 이동
accounts.get("/success", function(req, res) {
  res.send(req.user);
});
accounts.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/accounts/login");
});

module.exports = accounts;
