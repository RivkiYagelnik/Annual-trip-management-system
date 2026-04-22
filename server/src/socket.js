let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };