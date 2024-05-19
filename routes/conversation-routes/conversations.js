const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Conversation = require("../../models/conversation-models/ConversationSchema");

router.post("/conversations", async (req, res) => {
  const { user, doubtSolver } = req.body;
  if (!user || !doubtSolver) {
    return res.status(400).json({ success: false, error: "Please fill all the fields" });
  }
  try {
    let conversationData = await Conversation.findOne({ user, doubtSolver });
    if (!conversationData) {
        conversationData = await Conversation.create({
        user,
        doubtSolver,
      });
      res.json({ success: true, conversationData });
    }
    res.json({ success: true, conversationData });
  } catch (error) {
    res.json({ success: false, error: "Internal Server Error" });
  }
});


module.exports  = router;