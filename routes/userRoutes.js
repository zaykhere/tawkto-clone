const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message")
const generateToken = require("../utils/genToken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const RegisterValidation = require("../validation/registerValidation");
const {protect} = require("../middlewares/auth");

//Create Account
router.post("/register", async (req, res) => {
    const { error } = RegisterValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
  
    try {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists)
        return res.status(400).json({ error: "User already exists" });
  
      const toCipher = uuidv4();    
      const sha256Hasher = crypto.createHmac("sha256", process.env.CRYPTO_SECRET);  
      const hash = sha256Hasher.update(toCipher).digest('hex');

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        apiKey: hash
      });
  
      await user.save();
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
      };
      res.cookie("token", generateToken(user._id), options);

      const message = new Message({
        namespace: `/dynamic-${hash}`
      })
      await message.save();

      res.render("dashboard", {name: user.name});
    } catch (error) {
      console.log(error);
      res.json({ error: error.message });
    }
  });
  
  //Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ error: "No user exists with the entered email" });
  
      const matchPassword = await user.matchPassword(password);
      if (matchPassword) {
        const options = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
          };
          res.cookie("token", generateToken(user._id), options);
          const Message = 
          res.render("dashboard", {name: user.name});
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  //Logout
  router.get("/logout", protect, async(req,res) => {
    if(req.cookies.token)
      res.clearCookie("token");
    res.redirect("/signup");
  })

  //Generate Key
  router.get("/genscript", protect, async(req,res) => {
    try {
      const user = await User.findOne({_id: req.user.id});
      const apiKey = user.apiKey;

      const dirPath = path.join(__dirname, `../userFiles`);

      if (fs.existsSync(`${dirPath}/${apiKey}.js`)) {
        console.log("File exists already");
        console.log(`${dirPath}\\${apiKey}.js`);
        const data = fs.readFileSync(`${dirPath}\\${apiKey}.js`, {encoding: 'utf-8', flag: 'r'});

        res.json({
          message: "Add this script tag in your html file",
          scriptData: data
        })
      }

      else {

      let file = fs.createWriteStream(`${dirPath}/${apiKey}.js` , {flags: 'w'});

      file.write(`<script>\nlet div=document.createElement("div");let elem1=document.createElement("div");elem1.classList.add('chat-bubble');let elem1Msgs=document.createElement("div");elem1Msgs.classList.add('msgs');let elem1Status=document.createElement("div");elem1Status.classList.add('status');elem1.appendChild(elem1Msgs);elem1.appendChild(elem1Status);document.body.appendChild(elem1);let elem2=document.createElement("div");elem2.classList.add("chat-box","hide");document.body.appendChild(elem2);let elem2Messages=document.createElement("div");elem2Messages.classList.add('messages');elem2.appendChild(elem2Messages);let elem2Msg=document.createElement("div");elem2Msg.classList.add("msg");elem2Msg.textContent="Kathlyn : Hey! what's up?";elem2Messages.appendChild(elem2Msg);let elem3=document.createElement("div");elem3.classList.add('input-holder');elem2.appendChild(elem3);let elem3Control=document.createElement("div");elem3Control.classList.add("control");elem3.appendChild(elem3Control);let elem3Input=document.createElement("input");elem3Input.type="text";elem3Input.classList.add("chat-input");let elem3Button=document.createElement("button");elem3Button.textContent="Send";elem3Button.classList.add('chat-btn');elem3Control.appendChild(elem3Input);elem3Control.appendChild(elem3Button);var chatBubble=document.querySelector(".chat-bubble");var chatBox=document.querySelector('.chat-box');chatBubble.addEventListener("click",function(e){chatBox.classList.toggle('hide');chatBubble.classList.toggle('chat-bubble-hover')})
      var chatSocket=io("http://localhost:3000/dynamic-${apiKey}");var chatBtn=document.querySelector('.chat-btn');var input=document.querySelector('.chat-input');var messages=document.querySelector(".messages");input.addEventListener("keypress",function(event){if(event.key==="Enter"){event.preventDefault();if(input.value){chatSocket.emit('chat-message',input.value);input.value=''}}})
      chatBtn.addEventListener('click',function(e){e.preventDefault();if(input.value){chatSocket.emit('chat-message',input.value);input.value=''}});chatSocket.on('chat-message',function(msg){var item=document.createElement('div');item.classList.add('msg');item.textContent=msg;messages.appendChild(item);window.scrollTo(0,document.body.scrollHeight)}) \n</script>`)
      
      file.end();

      const data = fs.readFileSync(`${dirPath}\\${apiKey}.js`, {encoding: 'utf-8', flag: 'r'});

        res.json({
          message: "Add this script tag in your html file",
          scriptData: data
        })

    }

    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }) 

module.exports = router;