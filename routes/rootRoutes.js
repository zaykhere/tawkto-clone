const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/auth");

router.get("/signup", async(req,res) => {
    res.render("register");
})

router.get("/login", async(req,res) => {
    res.render("login");
})

router.get("/dashboard", protect , async(req,res) => {
    res.render("dashboard", {name: req.user.name});
})

router.get("/chat-dashboard", protect, async(req,res) => {
    const apiKey = req.user.apiKey;
    res.render("dashboardchat", {apiKey: apiKey})
})

module.exports = router;