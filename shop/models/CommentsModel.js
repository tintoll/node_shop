var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

var CommentsSchema = new Schema({
  content : String,
  create_id : {
    type : Date,
    default : Date.now()
  },
  product_id : Number
});

CommentsSchema.plugin(autoIncrement, {model:"comments", field : "id" , startAt:1});
module.exports = mongoose.model("comments", CommentsSchema);