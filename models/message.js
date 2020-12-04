const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderUsername: {
        type: String,
        required: true
    },
    receiverUsername: {
        type: String,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    messageDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("Message", messageSchema);