const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const ids = ["123"];

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use("/assets", express.static("assets"));
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DB_URL)
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

ids.forEach((id) => {
  let serve = io.of(`/${id}`);
  serve.on("connection", (socket) => {
    socket.on("chat-message", (msg) => {
      serve.emit("chat-message", msg);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
