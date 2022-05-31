const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use('/assets', express.static('assets'));
dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Import Routes
const scriptRoute = require("./routes/generateRoute");
const userRoute = require("./routes/userRoute");

//Use those routes
app.use("/", scriptRoute);
app.use("/api/user", userRoute);

io.on("connection", (socket) => {
  console.log("Connection established with socketd!!!");

  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  })  

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get("/generatescript", async (req, res) => {
  const chatNsp = io.of("/chat");
  chatNsp.on("connection", (socket) => {
    console.log(`${socket.it} connected to chat namespace`);
    /* chat namespace listeners here */
    socket.on('chat-message', (msg) => {
      io.emit('chat-message', msg);
    })  
  });

 
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

