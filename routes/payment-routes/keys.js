const express = require("express");

require("dotenv").config();
const router = express.Router();

router.get("/getKey",async(req,res)=>{
    res.send({KeyId:process.env.RAZORPAY_KEY_ID}).status(200);
})
router.get("/openAiKey",async(req,res)=>{
    res.send({KeyId:process.env.OPEN_AI_KEY}).status(200);
})

module.exports = router;