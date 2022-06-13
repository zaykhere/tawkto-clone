const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    messages: {
        type: [String],
    },
    namespace: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Message", msgSchema);