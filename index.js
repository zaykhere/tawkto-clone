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
const Message = require("./models/Message");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/assets", express.static("assets"));
dotenv.config({ path: "./config.env" });

//Configure ejs as view engine
app.set("view engine", "ejs"); 

//Database setup
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

//Server Socket
io.of(/^\/dynamic-[a-zA-Z0-9]+$/).on("connection", (socket) => {
  let email;
  const namespace = socket.nsp.name;

//  console.log(namespace);
  let namespaceToCheck = namespace.split('-');
  //console.log(namespaceToCheck[1])
  User.findOne({apiKey: namespaceToCheck[1]})
    .then((doc)=> {
      if(namespaceToCheck[1] == doc.apiKey) {

        socket.once("pass-email", (data) => {
          io.of(namespace).emit("pass-email", data);
          email = data;
          socket.join(data);
        })
        
        console.log("Valid Connection");

        socket.on("chat-message", (msg) => {
          //console.log(msg);
          
        Message.findOne({namespace: namespace})
          .then((doc) => {
           // console.log(doc);
            doc.messages.push(msg);
            doc.save().then((saved) => { return Promise.resolve(saved) });
          })

          console.log(socket.handshake);
          io.of(namespace).to(email).emit("chat-message", msg);
        })
      }
    })
    .catch((err)=> {
      console.log(err);
    })    
});

//Making io instance available to every other request handler
app.use(function(req, res, next) {
  req.io = io;
  next();
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Import Routes
const userRoute = require("./routes/userRoutes");
const rootRoute = require("./routes/rootRoutes");
const messageRoute = require("./routes/messageRoutes");

//Use those routes
app.use("/api/user", userRoute);
app.use("/", rootRoute);
app.use("/messages", messageRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});