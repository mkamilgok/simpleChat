const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("Log", logSchema);