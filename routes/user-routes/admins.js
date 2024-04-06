const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const secret_id = process.env.SECRET_ID;
const jwt = require("jsonwebtoken");
const Admin = require("../../models/user-models/admins");

// login

router.post("/loginAdmin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const adminData = await Admin.findOne({ email });
    if (adminData) {
      const passwordExisting = adminData.password;
      const isMatch = await bcrypt.compare(password, passwordExisting);
      if (isMatch) {
        const token = jwt.sign({ id: adminData._id }, secret_id);
        res.json({
            success: true,
          token:token,
          user: {
            name: adminData.name,
            email: adminData.email,
            phoneNumber: adminData.phoneNumber,
            age: adminData.age,
          },
        });
      } else {
        res.json({ success: false, error: "Invalid credentials" });
      }
    } else {
      res.json({ success: false, error: "User not found ! Please Register" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/registerAdmin", async (req, res) => {
   
    const { email, password ,phoneNumber,age,name } = req.body;
if (!email || !password || !phoneNumber || !age || !name) {
      return res.json({ success: false, error: "Please fill all the fields" });
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(password, salt);
  
    try {
      let adminData = await Admin.findOne({ email });
      if (!adminData) {
        // let courseHeadings = availableCourses.map(course => course.heading);
        let addedData = await Admin.create({
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
          error: "Admin with Same Email Already Exists !",
        });
      }
    } catch (error) {
      
      res.json({ success: false,error:"Internal Server Error"});
    }
  });

  router.get("/findAdminInfo", async (req, res) => {
    try {
      const { email } = req.query;
      if(!email) return res.json({ success: false, message: "Email is Required !" });
      const userData = await Admin.findOne({ email });
      if (userData) {
        res.json({ success: true, user: userData });
      } else {
        res.json({ success: false, message: "User not found !" });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, error: "Internal Server Error" });
    }
  });

  module.exports = router;