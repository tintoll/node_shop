var express = require("express");
var checkoutRouter = express.Router();

var CheckoutModel = require("../models/CheckoutModel");

checkoutRouter.get("/", (req, res) => {
  var totalAmount = 0;
  var cartList = {};
  if (typeof req.cookies.cartList !== "undefined") {
    cartList = JSON.parse(unescape(req.cookies.cartList));
    for (var key in cartList) {
      totalAmount += parseInt(cartList[key].amount);
    }
  }

  res.render("checkout/index", {
    cartList: cartList,
    totalAmount: totalAmount
  });
});

checkoutRouter.post("/complete", (req, res) => {
  var checkout = new CheckoutModel({
    imp_uid: req.body.imp_uid,
    merchant_uid: req.body.merchant_uid,
    paid_amount: req.body.paid_amount,
    apply_num: req.body.apply_num,

    buyer_email: req.body.buyer_email,
    buyer_name: req.body.buyer_name,
    buyer_tel: req.body.buyer_tel,
    buyer_addr: req.body.buyer_addr,
    buyer_postcode: req.body.buyer_postcode,

    status: req.body.status
  });

  checkout.save(err => {
    res.send({ message: "success" });
  });
});

checkoutRouter.post("/mobile_complete", (req, res) => {
  var checkout = new CheckoutModel({
    imp_uid: req.body.imp_uid,
    merchant_uid: req.body.merchant_uid,
    paid_amount: req.body.paid_amount,
    apply_num: req.body.apply_num,

    buyer_email: req.body.buyer_email,
    buyer_name: req.body.buyer_name,
    buyer_tel: req.body.buyer_tel,
    buyer_addr: req.body.buyer_addr,
    buyer_postcode: req.body.buyer_postcode,

    status: req.body.status
  });

  checkout.save(err => {
    res.send({ message: "success" });
  });
});

checkoutRouter.get("/success", (req, res) => {
  res.render("checkout/success");
});
module.exports = checkoutRouter;
