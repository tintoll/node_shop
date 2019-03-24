var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

var ProductsSchema = new Schema({
  name : String,
  price : Number,
  description : String,
  created_at : {
    type : Date,
    default : Date.now()
  }
});
// 1식 증가하는 primary key를 만든다.
// model : 생성할 document 이름
// field : primary key, startAt : 1부터 시작 
ProductsSchema.plugin(autoIncrement, {model : 'products', field:'id', startAt : 1});
module.exports = mongoose.model('products', ProductsSchema);