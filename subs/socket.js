const Redis = require("ioredis");
const io = require("socket.io")({
  cors: {
    origin: ["http://localhost:4000"],
  },
});

const subscriber = new Redis;

io.on("connection", (socket) => {

  // Subscriber set to publisher
  subscriber.subscribe("publish-data", (err, count) => {
    if (err) console.error(err.message);
    console.log(`Subscribed to ${count} channels.`);
  });

  // Moving data to socket when data comes from Publisher
  subscriber.on("message", (channel, message) => {
    console.log(`Received message from ${channel} channel.`);
    socket.emit('message', message);
  });

  // When the socket is disconnected, the subscriber redis is closed
  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
    subscriber.quit()
  });
});

io.listen(3501);
