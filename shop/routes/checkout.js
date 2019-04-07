var express = require('express');
var checkoutRouter = express.Router();

checkoutRouter.get('/', (req, res) => {

  var totalAmount = 0;
  var cartList = {};
  if (typeof (req.cookies.cartList) !== 'undefined') {
    cartList = JSON.parse(unescape(req.cookies.cartList));
    for (var key in cartList) {
      totalAmount += parseInt(cartList[key].amount);
    }
  }

  res.render('checkout/index', { cartList: cartList, totalAmount: totalAmount });

})

module.exports = checkoutRouter;