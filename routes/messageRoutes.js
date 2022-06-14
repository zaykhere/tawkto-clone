const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/all/:namespace", async(req,res) => {
    try {
        const namespace = `/${req.params.namespace}`;
        const messageModel = await Message.findOne({namespace: namespace});

        const messages = messageModel.messages;

        res.status(200).json({messages});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
})

module.exports = router;

