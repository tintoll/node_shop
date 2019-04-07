var express = require('express');
var cartRouter = express.Router();

cartRouter.get('/', function(req, res) {
  var totalAmount = 0;
  var cartList = {};
  if( typeof(req.cookies.cartList) !== 'undefined') {
    cartList = JSON.parse(unescape(req.cookies.cartList));
    for(var key in cartList) {
      totalAmount += parseInt(cartList[key].amount);
    }
  } 

  res.render('cart/index', {cartList : cartList, totalAmount : totalAmount});
});


module.exports = cartRouter;