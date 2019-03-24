var express = require("express");

var admin = express.Router();

admin.get("/products", function(req, res) {
  // message란 변수를 템플릿으로 내보낸다.
  res.render("admin/products", { message: "hello" });
});
admin.get("/products/write", function(req, res) {
  res.send("GET /admin/products/write");
});
admin.post("/products/write", function(req, res) {
  res.send("POST /admin/products/write");
});

module.exports = admin;
