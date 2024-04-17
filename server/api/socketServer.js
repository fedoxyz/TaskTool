const { Server } = require("socket.io");

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_HOST,
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", (reason) => {
      console.log(reason, "client disconnected");
    });
  });

  return io;
}

module.exports = { setupSocketServer };
