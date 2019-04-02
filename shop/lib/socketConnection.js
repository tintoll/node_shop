require("./removeByValue")();

module.exports = function(io) {
  var userList = []; // 사용자 리스트를 저장할 곳

  io.on("connection", function(socket) {
    // passport의 req.user의 데이터에 접근
    var session = socket.request.session.passport;
    var user = typeof session !== "undefined" ? session.user : "";

    if (userList.indexOf(user.displayName) === -1) {
      userList.push(user.displayName);
    }
    io.emit("join", userList);

    socket.on("client message", function(data) {
      io.emit("server message", {
        message: data.message,
        displayName: user.displayName
      });
    });

    socket.on("disconnect", function() {
      userList.removeByValue(user.displayName);
      io.emit("leave", userList);
    });
  });
};
