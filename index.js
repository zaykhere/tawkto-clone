const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
