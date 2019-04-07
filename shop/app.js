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

var home = require("./routes/home");
var admin = require("./routes/admin");
var accounts = require("./routes/accounts");
var auth = require("./routes/auth");
var chat = require("./routes/chat");
var products = require("./routes/products");
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');

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
app.use("/static", express.static("static"));

// 쿠키사용
app.use(cookieParser());

// session 셋팅
var connectMongo = require("connect-mongo");
var MongoStore = connectMongo(session);
var sessionMiddleware = session({
  secret: "mysecret", // 쿠키임의 변조 방비
  resave: false,
  saveUninitialized: true, // 세션에 저장되기전에 uninitialized가 됨.
  cookie: {
    maxAge: 2000 * 60 * 60 // 지속시간 2시간
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60
  })
});

app.use(sessionMiddleware);

// passport 적용
app.use(passport.initialize());
app.use(passport.session());

// flash 메시지
app.use(flash());

// 로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어 router위에 두어야됨.
app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  // app.locals.urlparameter = req.url; // 현재 url 정보를 보내고 싶으면 설정
  // app.locals.userData = req.user; // 사용자 정보를 보내고 싶은면 설정
  next();
});

// Routers
app.use("/", home);
app.use("/admin", admin);
app.use("/accounts", accounts);
app.use("/auth", auth);
app.use("/chat", chat);
app.use("/products", products);
app.use("/cart", cart);
app.use("/checkout", checkout);

var server = app.listen(port, function() {
  console.log("Express listening on port ", port);
});

// socket.io 설정
var listen = require("socket.io");
var io = listen(server);
// passport 접근하기 위한 미들웨어 적용
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

require("./lib/socketConnection")(io);
