const mongoose = require("mongoose");

const Message = mongoose.Schema({
    conversationId:{
        type: String
    },
    senderId:{
        type: String
    },
    receiverId:{
        type: String
    },
    message:{
        type: String
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Messages", Message);