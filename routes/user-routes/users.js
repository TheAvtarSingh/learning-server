const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/user-models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");

// signup
router.post("/registerUser", async (req, res) => {
  // const user = new User(req.body);
  let email = req.body.email;
  const salt = await bcrypt.genSalt(10);
  let secPassword = await bcrypt.hash(req.body.password, salt);

  try {
    let userData = await User.findOne({ email });
    if (!userData) {
      let addedData = await User.create({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        password: secPassword,
      });
      let encryptedId = await bcrypt.hash(addedData._id.toString(), salt);
      res.json({ success: true, _id: encryptedId });
    } else {
      res.json({
        success: false,
        error: "User with Same Email Already Exists !",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

// Login

router.post("/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    // Password Field

    if (userData) {
      const passwordExisting = userData.password;
      const isPasswordValid = await bcrypt.compare(password, passwordExisting);
      if (isPasswordValid) {
        res.json({
          success: true,
          user: {
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
          },
        });
      } else {
        // Password not Correct
        res.json({ success: false, error: "Invalid credentials" });
      }
    } else {
      // Email not exists
      res.json({ success: false, error: "User not found ! Please Register" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
