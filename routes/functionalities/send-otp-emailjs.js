const express = require("express");
const router = express.Router();
const emailjs = require("@emailjs/nodejs");
const { getPODTGFG } = require("../../utils/Scrapper");

const publickey = process.env.PUBLIC_KEY;
const serviceid = process.env.SERVICE_ID;
const templateid = process.env.TEMPLATE_ID;
const privatekey = process.env.PRIVATE_ID;

router.get("/getProblemOfTheDayGfg", async (req, res) => {
  console.log("here");
  await getPODTGFG("https://www.geeksforgeeks.org/problem-of-the-day")
    .then((url) =>{

    
    
      res.json({
        success: true,
        message: url,
      })
      console.log(url);
      }
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
        message: error,
      });
    });
});

router.post("/sendEmail", async (req, res) => {
  try {
    const templateParams = req.body;

    emailjs
      .send(serviceid, templateid, templateParams, {
        publicKey: publickey,
        privateKey: privatekey,
      })
      .then(
        (result) => {
          res.json({ success: true, message: "OTP Send Successfully!" });
        },
        (error) => {
          res.json({
            success: false,
            message: error,
          });
        }
      );
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
