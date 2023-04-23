const Redis = require("ioredis");
const express = require("express")

const subscriber = new Redis();
const app = express();

app.get("/sse", (req, res) => {
  // Set the response headers for SSE
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Set up a Redis subscriber to listen for messages on the 'publish-data' channel
  subscriber.subscribe("publish-data");

  // When a message is received, send it to the client as an SSE event
  subscriber.on("message", (channel, message) => {
    res.write(`event: message\n`);
    res.write(`data: ${message}\n\n`);
  });

  // When the client closes the SSE connection, unsubscribe from the 'publish-data' channel and end the response
  req.on("close", () => {
    subscriber.unsubscribe("publish-data");
    res.end();
  });
});

app.listen(3502, () => {
  console.log("Server started on port 3502");
});
