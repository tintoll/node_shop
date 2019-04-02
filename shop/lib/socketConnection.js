require("./removeByValue")();

module.exports = function(io) {
  var userList = []; // 사용자 리스트를 저장할 곳

  io.on("connection", function(socket) {
    // passport의 req.user의 데이터에 접근
    var session = socket.request.session.passport;
    var user = typeof session !== "undefined" ? session.user : "";

    console.log(`user : ${user.displayname}`);

    if (userList.indexOf(user.displayname) === -1) {
      userList.push(user.displayname);
    }
    io.emit("join", userList);

    socket.on("client message", function(data) {
      io.emit("server message", {
        message: data.message,
        displayname: user.displayname
      });
    });

    socket.on("disconnect", function() {
      userList.removeByValue(user.displayname);
      io.emit("leave", userList);
    });
  });
};
