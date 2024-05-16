const mongoose = require("mongoose");

const Payment = mongoose.Schema({
    userEmail: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    amount: {
        type: Number
    },
    successCredits: {
        type: Number
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Payment", Payment);
