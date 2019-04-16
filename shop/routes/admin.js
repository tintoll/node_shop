var express = require("express");

var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });

var co = require("co");
var paginate = require("express-paginate");

var admin = express.Router();

var loginRequired = require("../lib/loginRequired");
var adminRequired = require("../lib/adminRequired");

var ProductsModel = require("../models/ProductsModel");
var CommentsModel = require("../models/CommentsModel");
var CheckoutModel = require("../models/CheckoutModel");

// 이미지 저장되는 위치 설정
var path = require("path");
var uploadDir = path.join(__dirname, "../uploads");
var fs = require("fs");

// multer 설정
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    // 이미지가 저장되는 도착지 지정
    callback(null, uploadDir);
  },
  filename: function(req, file, callback) {
    callback(
      null,
      "products-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  }
});
var upload = multer({ storage: storage });

admin.get("/products", paginate.middleware(3, 50), async function(req, res) {
  const [results, itemCount] = await Promise.all([
    ProductsModel.find()
      .sort("-created_at")
      .limit(req.query.limit)
      .skip(req.skip)
      .exec(),
    ProductsModel.count({})
  ]);

  const pageCount = Math.ceil(itemCount / req.query.limit);

  const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);

  res.render("admin/products", {
    products: results,
    pages: pages,
    pageCount: pageCount
  });
});

admin.get("/products/detail/:id", function(req, res) {
  /*
  //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
  ProductsModel.findOne({ id: req.params.id }, function(err, product) {
    //제품정보를 받고 그안에서 댓글을 받아온다.
    CommentsModel.find({ prodocut_id: req.body.id }, function(err, comments) {
      res.render("admin/productDetail", {
        product: product,
        comments: comments
      });
    });
  });
  */

  // co와 제너레이터를 이용한 콜백헬 해결
  /*
  var getData = co(function*() {
    var product = yield ProductsModel.findOne({ id: req.params.id }).exec();
    var comments = yield CommentsModel.find({
      prodocut_id: req.body.id
    }).exec();
    return {
      product: product,
      comments: comments
    };
  });
  getData.then(function(result) {
    res.render("admin/productDetail", {
      product: result.product,
      comments: result.comments
    });
  });
  */

  var getDataByAsync = async () => ({
    product: await ProductsModel.findOne({ id: req.params.id }).exec(),
    comments: await CommentsModel.find({ prodocut_id: req.body.id }).exec()
  });
  getDataByAsync().then(function(result) {
    res.render("admin/productDetail", {
      product: result.product,
      comments: result.comments
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

admin.post("/products/ajax_comment/delete", function(req, res) {
  CommentsModel.remove({ id: req.body.comment_id }, function(err) {
    res.json({ message: "success" });
  });
});

admin.get("/products/write", adminRequired, csrfProtection, function(req, res) {
  res.render("admin/form", { product: "", csrfToken: req.csrfToken() });
});
admin.post(
  "/products/write",
  loginRequired,
  upload.single("thumbnail"),
  csrfProtection,
  function(req, res) {
    console.log(req.file);
    var product = new ProductsModel({
      name: req.body.name,
      thumbnail: req.file ? req.file.filename : "",
      price: req.body.price,
      description: req.body.description,
      username: req.user.username
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
  }
);

admin.get("/products/edit/:id", adminRequired, csrfProtection, function(
  req,
  res
) {
  ProductsModel.findOne({ id: req.params.id }, function(err, product) {
    res.render("admin/form", { product: product, csrfToken: req.csrfToken() });
  });
});
admin.post(
  "/products/edit/:id",
  loginRequired,
  upload.single("thumbnail"),
  function(req, res) {
    // DB에 저장되 있는 파일명을 받아온다.
    ProductsModel.findOne({ id: req.params.id }, function(err, product) {
      if (req.file) {
        // 요청중에 파일이 존재할시 이전이미지를 지운다.
        // 동기 방식
        if (product.thumbnail) {
          fs.unlinkSync(uploadDir + "/" + product.thumbnail);
        }
      }

      // 넣을 변수 값을 셋팅
      var query = {
        name: req.body.name,
        thumbnail: req.file ? req.file.filename : product.thumbnail,
        price: req.body.price,
        description: req.body.description
      };

      ProductsModel.update({ id: req.params.id }, { $set: query }, function(
        err
      ) {
        res.redirect("/admin/products/detail/" + req.params.id);
      });
    });
  }
);

admin.get("/products/delete/:id", function(req, res) {
  ProductsModel.remove({ id: req.params.id }, function(err, product) {
    res.redirect("/admin/products");
  });
});

admin.post(
  "/products/ajax_summernote",
  adminRequired,
  upload.single("thumbnail"),
  function(req, res) {
    res.send("/uploads/" + req.file.filename);
  }
);

admin.get("/order", (req, res) => {
  CheckoutModel.find((err, orderList) => {
    res.render("admin/orderList", { orderList });
  });
});

admin.get("/order/edit/:id", (req, res) => {
  CheckoutModel.findOne({ id: req.params.id }, function(err, order) {
    res.render("admin/orderForm", { order: order });
  });
});

admin.get("/statistics", adminRequired, (req, res) => {
  CheckoutModel.find(function(err, orderList) {
    var barData = [];
    var pieData = [];

    orderList.forEach(function(order) {
      var date = new Date(order.create_at);
      var monthDay = date.getMonth() + 1 + "-" + date.getDate();

      // 날짜에 해당하는 키값으로 조회
      if (monthDay in barData) {
        barData[monthDay]++; // 있으면 더한다.
      } else {
        barData[monthDay] = 1; // 없으면 초기값 1
      }

      // 결재 상태를 검색해서 조회
      if (order.status in pieData) {
        pieData[order.status] = pieData[order.status] + 1;
      } else {
        pieData[order.status] = 1;
      }
    });

    res.render("admin/statistics", { barData, pieData });
  });
});

module.exports = admin;
