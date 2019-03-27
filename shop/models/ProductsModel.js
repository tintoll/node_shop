var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

var ProductsSchema = new Schema({
  name : {
    type : String,
    required : [true, '제목은 입력해주세요']
  },
  thumbnail : String, // 이미지 파일명
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


// Object create 의 get과 set과 비슷함
//set은 변수의 값을 바꾸거나 셋팅하면 호출
// get은 getDate변수를 호출하는 순간 날짜 월일이 찍힌다.
ProductsSchema.virtual('getDate').get(function(){
  var date = new Date(this.created_at);
  return {
    year : date.getFullYear(),
    month : date.getMonth()+1,
    day : date.getDate()
  }
});

module.exports = mongoose.model('products', ProductsSchema);