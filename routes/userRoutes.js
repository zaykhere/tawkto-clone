const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/genToken");
const crypto = require("crypto");
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
      res.json({ success: true });
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
        res.json({
          success: true
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  //Generate Key
  router.post("/genscript", protect, async(req,res) => {
    res.send(req.user);
  })

module.exports = router;