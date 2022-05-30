const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/script", async(req,res) => {
    const jsBuffer = fs.readFileSync(path.join(__dirname, '.././assets/script.js'));
    const cssBuffer = fs.readFileSync(path.join(__dirname, '.././assets/style.css'));

    let jsText = jsBuffer.toString();
    jsText = jsText.replace(/(\r\n|\n|\r)/gm, "");

    let cssText = cssBuffer.toString();
    cssText = cssText.replace(/(\r\n|\n|\r)/gm, "");

    res.json({
        scriptLink: jsText,
        cssLink: cssText
    })
})

router.get("/generatescript", async(req,res) =>{
    
})

module.exports = router;