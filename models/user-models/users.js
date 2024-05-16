const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  coursesEnrolled: {
    type: [String],
    default: [],
  },
paymentsMade :{
  type: [Object],
  default: [],
},
  successCredits: {
    type: Number,
    default: 0,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
