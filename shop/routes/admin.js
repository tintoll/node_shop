var express = require("express");

var csrf = require('csurf');
var csrfProtection = csrf({cookie : true});

var admin = express.Router();

var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');

admin.get("/products", function(req, res) {

  ProductsModel.find(function(err, products){
    res.render("admin/products", { products: products });
  });
  
});

admin.get("/products/detail/:id", function(req, res) {
   //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
  ProductsModel.findOne({ id: req.params.id }, function(err, product) {
    //제품정보를 받고 그안에서 댓글을 받아온다.
    CommentsModel.find({prodocut_id:req.body.id}, function(err, comments){
      res.render("admin/productDetail", { product: product, comments : comments });
    });
    
    
  });
});

admin.post("/products/ajax_comment/insert", function(req, res) {
  var comment = new CommentsModel({
    content: req.body.content,
    prodocut_id: parseInt(req.body.prodocut_id)
  });

  comment.save(function(err, comment) {
    res.json({
      id: comment.id,
      content: comment.content,
      message: "success"
    });
  });
});

admin.post("/products/ajax_comment/delete", function (req, res) {
  CommentsModel.remove({id : req.body.comment_id}, function(err){
    res.json({message : 'success'});
  });
});


admin.get("/products/write", csrfProtection, function(req, res) {
  res.render('admin/form',{product:"", csrfToken : req.csrfToken()});
});
admin.post("/products/write", csrfProtection, function(req, res) {
  var product = new ProductsModel({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  });

  // 유효성체크
  var validationError = product.validateSync();
  if (validationError) {
    res.send(validationError);
  } else {
    product.save(function(err) {
      res.redirect("/admin/products");
    });
  }
});



admin.get("/products/edit/:id", function (req, res) {
  ProductsModel.findOne({ 'id': req.params.id }, function (err, product) {
    res.render('admin/form', { product: product });
  });
});
admin.post("/products/edit/:id", function (req, res) {
  var query = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }

  ProductsModel.update({ id: req.params.id }, { $set: query }, function (err) {
    res.redirect('/admin/products/detail/' + req.params.id);
  });
});

admin.get("/products/delete/:id", function(req, res) {
  ProductsModel.remove({ id: req.params.id }, function(err, product) {
    res.redirect('/admin/products');
  });
});



module.exports = admin;
