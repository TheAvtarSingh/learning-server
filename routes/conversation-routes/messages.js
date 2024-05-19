const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Message = require("../../models/conversation-models/messageSchema");

router.post("/messages", async (req, res) => {
    const { conversationId, senderId,receiverId, message } = req.body;
    if (!conversationId || !senderId || !receiverId || !message) {
        return res.status(400).json({ success: false, error: "Please fill all the fields conversationId, senderId,receiverId, message" });
    }
    try {
        let messageData = await Message.create({
        conversationId,
        senderId,
        receiverId,
        message
        });
        res.json({ success: true, messageData });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" });
    }
    }
);


router.get("/messages/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    if (!conversationId) {
        return res.status(400).json({ success: false, error: "Please fill all the fields conversationId" });
    }
    try {
        let messages = await Message.find({conversationId});
        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" });
    }
    }   
);

module.exports  = router;