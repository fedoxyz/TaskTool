const { Server } = require('socket.io');

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_HOST,
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });


  io.on('connection', socket => {
    console.log("Client connected");

    socket.on("disconnect", (reason) => {
      console.log(reason, 'client disconnected');
    });

    // Add this listener for the add task event
    socket.on("add-task", message => {
      console.log("Test event received on server-side");
      console.log("Received message:", message);
      io.emit('test-event', message);
    });
    // Add this listener for the remove task event
    socket.on("remove-task", message => {
      console.log("Test event received on server-side");
      console.log("Received message:", message);
      io.emit('test-event', message);
    });

  });

return io

}

module.exports = { setupSocketServer };