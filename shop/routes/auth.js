var express = require("express");
var authRouter = express.Router();
var UserModel = require("../models/UserModel");

var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(
  new FacebookStrategy(
    {
      clientID: "222",
      clientSecret: "111",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"] // 받고 싶은 필드 나열
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      UserModel.findOne({ username: "fb_" + profile.id }, function(err, user) {
        if (!user) {
          // 업으면 회원가입후 로그인 성공페이지 이동
          var regData = {
            username: "fb_" + profile.id,
            password: "facebook_login",
            displayName: profile.displayName
          };
          var User = new UserModel(regData);
          User.save(function(err) {
            done(null, regData); // 세션등록
          });
        } else {
          // 있으면 DB에서 가져와서 세션등록
          done(null, user);
        }
      });
    }
  )
);

authRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/auth/facebook/fail"
  })
);
authRouter.get("/facebook/success", function(req, res) {
  res.send(req.user);
});
authRouter.get("/facebook/fail", function(req, res) {
  res.send("facebook login fail");
});

module.exports = authRouter;
