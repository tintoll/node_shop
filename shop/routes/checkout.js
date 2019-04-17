var express = require("express");

var request = require('request');
var cheerio = require('cheerio');
var removeEmpty = require('../lib/removeEmpty');

var checkoutRouter = express.Router();

var CheckoutModel = require("../models/CheckoutModel");

const { Iamporter, IamporterError } = require("iamporter");
const iamporter = new Iamporter({
  apiKey: "REST API 키",
  secret: "REST API secret"
});

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

checkoutRouter.get("/complete", (req, res) => {
  var asysncFunc = async () => {
    var payData = await iamporter.findByImpUid(req.query.imp_uid);
    var checkout = new CheckoutModel({
      imp_uid: payData.data.imp_uid,
      merchant_uid: payData.data.merchant_uid,
      paid_amount: payData.data.amount,
      apply_num: payData.data.apply_num,

      buyer_email: payData.data.buyer_email,
      buyer_name: payData.data.buyer_name,
      buyer_tel: payData.data.buyer_tel,
      buyer_addr: payData.data.buyer_addr,
      buyer_postcode: payData.data.buyer_postcode,

      status: "결재완료"
    });
    await checkout.save();
  };
  asysncFunc().then(function(result) {
    res.redirect("/checkout/success");
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


checkoutRouter.get('/nomember', (req, res) => {
  res.render('checkout/nomember');
});
checkoutRouter.get('/nomember/search', (req, res) => {
  CheckoutModel.find({buyer_email : req.query.email}, function(err, checkoutList) {
    res.render('checkout/search', {checkoutList : checkoutList});
  });
})


checkoutRouter.get('/shipping/:invc_no', (req, res) => {
  
  // 대한 통운 배송위치 크롤링 주소
  var url = 'https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=' + req.params.invc_no ;
  var result = []; // 최종 보내는 데이터
  request(url, (error, response, body) => {
    // 한글 변환
    var $ = cheerio.load(body, { decodeEntities : false});
    var tdElements = $('.board_area').find('table.mb15 tbody tr td');
    console.log(tdElements);
    //res.send('1111');
    
    //한 row가 4개의 칼럼으로 이루어져 있으므로
    // 4로 나눠서 각각의 줄을 저장한 한줄을 만든다
    for (var i = 0; i < tdElements.length; i++) {
      if (i % 4 === 0) {
        var temp = {}; //임시로 한줄을 담을 변수
        temp["step"] = removeEmpty(tdElements[i].children[0].data);
        //removeEmpty의 경우 step의 경우 공백이 많이 포함됨
      } else if (i % 4 === 1) {
        temp["date"] = tdElements[i].children[0].data;
      } else if (i % 4 === 2) {

        //여기는 children을 1,2한게 배송상태와 두번째줄의 경우 담당자의 이름 br로 나뉘어져있다.
        // 0번째는 배송상태, 1은 br, 2는 담당자 이름
        temp["status"] = tdElements[i].children[0].data;
        if (tdElements[i].children.length > 1) {
          temp["status"] += tdElements[i].children[2].data;
        }

      } else if (i % 4 === 3) {
        temp["location"] = tdElements[i].children[1].children[0].data;
        result.push(temp); //한줄을 다 넣으면 result의 한줄을 푸시한다
        temp = {}; //임시변수 초기화 
      }
    }

    res.render('checkout/shipping', { result: result }); //최종값 전달
  });
});


module.exports = checkoutRouter;
