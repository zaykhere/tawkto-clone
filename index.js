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

app.set("view engine", "ejs"); 

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

io.of(/^\/dynamic-[a-zA-Z0-9]+$/).on("connection", (socket) => {
  const namespace = socket.nsp.name;
  let namespaceToCheck = namespace.split('-');
  console.log(namespaceToCheck[1])
  User.findOne({apiKey: namespaceToCheck[1]})
    .then((doc)=> {
      if(namespaceToCheck[1] == doc.apiKey) {
        console.log("Valid Connection");
        socket.on("chat-message", (msg) => {
          console.log(msg);
          io.of(namespace).emit("chat-message", msg);
        })
      }
    })
    .catch((err)=> {
      console.log(err);
    })    
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Import Routes
const userRoute = require("./routes/userRoutes");

//Use those routes
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
