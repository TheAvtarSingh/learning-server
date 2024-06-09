const express = require("express");
const crypto = require('crypto')

require("dotenv").config();
const router = express.Router();


router.get("/getKey",async(req,res)=>{
    res.send({KeyId:process.env.RAZORPAY_KEY_ID}).status(200);
})
router.get("/openAiKey",async(req,res)=>{
    res.send({KeyId:process.env.OPEN_AI_KEY}).status(200);
})

router.get("/getBardKey", async (req, res) => {
    try {
        const data = process.env.BARD_KEY;
        if (!data) {
            return res.status(500).json({ error: 'BARD_KEY is not defined in the environment variables' });
        }

        const hash = crypto.createHash('sha256').update(data).digest('hex');

        const encryptedData = `${hash.substring(0, 5)}${data}${hash.substring(5)}`;

        res.json({
            encryptedData: encryptedData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during the process' });
    }
});
module.exports = router;