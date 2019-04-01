var express = require('express');
var homeRouter = express.Router();
var ProductsModel = require("../models/ProductsModel");

homeRouter.get('/',function(req, res){
  ProductsModel.find(function(err, products){
    res.render('home',{products : products});
  });
});

module.exports = homeRouter;