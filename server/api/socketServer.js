const { Server } = require('socket.io');

function setupSocketServer(httpServer, port) {
  const io = new Server(httpServer, {
    cors: {
      origin: `http://localhost:${port}`,
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });


  io.on('connection', socket => {
    console.log("Client connected");

    socket.on("disconnect", (reason) => {
      console.log(reason, 'client disconnected');
    });

    // Add this listener for the "test" event
    socket.on("test", message => {
      console.log("Test event received on server-side");
      console.log("Received message:", message);

      // Emit a "test-event" event back to the client
      io.emit('test-event', message);
    });
  });

}

module.exports = { setupSocketServer };