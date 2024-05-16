const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();
const router = express.Router();
const crypto = require("crypto");
const payment = require("../../models/payments-models/payment");

router.post("/checkout", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_secret: process.env.RAZORPAY_SECRET,
            key_id: process.env.RAZORPAY_KEY_ID,
        });

        const options = {
            amount: Number(req.body.amount*100), 
            currency: "INR"
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occurred");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/paymentVerification", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,name,email,frontendUrl } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await payment.create({
        name,
        email ,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    
    res.redirect(`${frontendUrl}/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
        error:"Payment Failed",
      success: false,
    });
  }
});

module.exports = router;
