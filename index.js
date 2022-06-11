const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User = require("./models/User");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookieParser());

app.use("/assets", express.static("assets"));
dotenv.config({ path: "./config.env" });



mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

User.find().then((doc)=> {
  console.log(doc);
})


//Import Routes
const userRoute = require("./routes/userRoutes");

//Use those routes
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
