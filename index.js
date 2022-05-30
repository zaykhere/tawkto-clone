const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors');

app.use(cors());

app.use('/assets', express.static('assets'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Import Routes
const scriptRoute = require("./routes/generateRoute");

//Use those routes
app.use("/", scriptRoute);

io.on("connection", (socket) => {
  console.log("Connection established with socketd!!!");

  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  })  

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
