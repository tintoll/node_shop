var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var { autoIncrement } = require("mongoose-plugin-autoinc");

var CheckoutSchema = new Schema({
  imp_uid: String, // 고유 ID
  merchant_uid: String, // 상점 거래 ID
  paid_amount: Number, // 결재 금액
  apply_num: String, // 카드 승인번호

  buyer_email: String, // 이메일
  buyer_name: String,
  buyer_tel: String,
  buyer_addr: String,
  buyer_postcode: String, // 우편번호

  status: String, // 결재완료, 배송중 등
  song_jang: String, // 송장번호
  create_at: {
    type: Date,
    default: Date.now()
  }
});

CheckoutSchema.plugin(autoIncrement, {
  model: "checkout",
  fiedl: "id",
  startAt: 1
});

CheckoutSchema.virtual("getDate").get(function() {
  var date = new Date(this.create_at);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
});
module.exports = mongoose.model("checkout", CheckoutSchema);
