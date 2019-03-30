var crypto = require("crypto");
var mysalt = "salt";

module.exports = function(password) {
  return crypto
    .createHash("sha512")
    .update(password + mysalt)
    .digest("base64");
};
