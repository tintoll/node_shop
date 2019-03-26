var path = require("path");
var express = require("express");
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var admin = require("./routes/admin");

var app = express();
var port = 3000;

// MongoDB 접속
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('mongodb connect');
});
mongoose.connect('mongodb://127.0.0.1:27017/fc');



// 확장자가 ejs로 끝나는 뷰엔진을 추가한다.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 쿠키사용
app.use(cookieParser());

app.get("/", function(req, res) {
  res.send("first app");
});

app.use("/admin", admin);

app.listen(port, function() {
  console.log("Express listening on port ", port);
});
