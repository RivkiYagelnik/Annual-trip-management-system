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
    
    socket.on("teacher:join", async (teacherId) => {
      socket.join(`teacher:${teacherId}`);
      console.log(`Teacher ${teacherId} joined room`);

      // Send last location immediately upon connection
      const TeacherLocation = require("./models/TeacherLocation.model");
      const last = await TeacherLocation.findOne({ teacherId });
      if (last) {
        socket.emit("teacher:location", {
          latitude: last.latitude,
          longitude: last.longitude,
        });
      }
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };