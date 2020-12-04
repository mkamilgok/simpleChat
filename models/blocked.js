const mongoose = require("mongoose");

const blockedSchema = new mongoose.Schema({
    blockedUsername: {
        type: String,
        required: true
    },
    byUsername: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Blocked", blockedSchema);