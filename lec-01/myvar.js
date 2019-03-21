var a = "hello";
// module.exports.a = a;

// literal
// module.exports = {
//   a: "Return literal"
// };

// function
// module.exports.a = function() {
//   return "Return function";
// };

// Instance
function Myvar() {
  this.name = "my Instance";
}
module.exports = Myvar;
