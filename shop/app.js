var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

// flash 메시지 관련
var flash = require("connect-flash");
// passport 로그인관련
var passport = require("passport");
var session = require("express-session");

var admin = require("./routes/admin");
var accounts = require("./routes/accounts");
var auth = require("./routes/auth");

var app = express();
var port = 3000;

// MongoDB 접속
var mongoose = require("mongoose");
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function() {
  console.log("mongodb connect");
});
mongoose.connect("mongodb://127.0.0.1:27017/fc");

// 확장자가 ejs로 끝나는 뷰엔진을 추가한다.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어 셋팅
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 업로드 path 추가
app.use("/uploads", express.static("uploads"));

// 쿠키사용
app.use(cookieParser());

// session 셋팅
app.use(
  session({
    secret: "mysecret", // 쿠키임의 변조 방비
    resave: false,
    saveUninitialized: true, // 세션에 저장되기전에 uninitialized가 됨.
    cookie: {
      maxAge: 2000 * 60 * 60 // 지속시간 2시간
    }
  })
);

// passport 적용
app.use(passport.initialize());
app.use(passport.session());

// flash 메시지
app.use(flash());

app.get("/", function(req, res) {
  res.send("first app");
});

app.use("/admin", admin);
app.use("/accounts", accounts);
app.use("/auth", auth);

app.listen(port, function() {
  console.log("Express listening on port ", port);
});
