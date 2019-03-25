var express = require("express");
var admin = express.Router();

var ProductsModel = require('../models/ProductsModel');

admin.get("/products", function(req, res) {

  ProductsModel.find(function(err, products){
    res.render("admin/products", { products: products });
  });
  
});
admin.get("/products/write", function(req, res) {
  res.render('admin/form');
});

admin.post("/products/write", function(req, res) {
  
  var product = new ProductsModel({
    name : req.body.name,
    price : req.body.price,
    description : req.body.description,
  });

  product.save(function(err) {
    res.redirect('/admin/products');
  });

});

module.exports = admin;
