const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

router.get("/script", async (req, res) => {
  const jsBuffer = fs.readFileSync(
    path.join(__dirname, ".././assets/script.js")
  );
  const cssBuffer = fs.readFileSync(
    path.join(__dirname, ".././assets/style.css")
  );

  let jsText = jsBuffer.toString();
  jsText = jsText.replace(/(\r\n|\n|\r)/gm, "");

  let cssText = cssBuffer.toString();
  cssText = cssText.replace(/(\r\n|\n|\r)/gm, "");

  res.json({
    scriptLink: `http://localhost:3000/assets/script.js`,
    cssLink: `http://localhost:3000/assets/style.css`,
  });
});


module.exports = router;
