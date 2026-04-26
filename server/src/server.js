require("dotenv").config();
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const { buildCache } = require("./classroomCache");

initSocket(server);
buildCache(); // Builds the cache once on upload

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});