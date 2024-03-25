const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/user-models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");
const secret_id = process.env.SECRET_ID;
const jwt = require("jsonwebtoken");
const availableCourses = [
  {
    _id: 1,
    imageLink: "./images/dashboard/java_course_1.jpg",
    heading: "Learn Java Basics",
    description: "Premium content to Learn Java Basics",
    linktoredirect: "/learn-oops-in-java",
    isCompleted: false,
    isEnrolled: false,
  },
  {
    _id: 2,
    imageLink: "./images/dashboard/java_course_2.jpg",
    heading: "Learn Inheritance",
    description:
      "Premium content to Java Access Modifiers (Inheritance Basics)",
    linktoredirect: "/learn-oops-in-java",
    isCompleted: false,
    isEnrolled: false,
  },
  {
    _id: 3,
    imageLink: "./images/dashboard/java_course_3.jpg",
    heading: "Learn Inheritance",
    description: "Premium content to learn Inheritance",
    linktoredirect: "/learn-oops-in-java",
    isCompleted: false,
    isEnrolled: false,
  },
];

// signup
router.post("/registerUser", async (req, res) => {
  // const user = new User(req.body);
  let email = req.body.email;
  const salt = await bcrypt.genSalt(10);
  let secPassword = await bcrypt.hash(req.body.password, salt);

  try {
    let userData = await User.findOne({ email });
    if (!userData) {
      // let courseHeadings = availableCourses.map(course => course.heading);
      let addedData = await User.create({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        password: secPassword,
        learnings: availableCourses, // Assign course headings as array of strings
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

router.get("/findUserInfo", async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email });
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

// Login

router.post("/loginUser", async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const userData = await User.findOne({ email });
    // Password Field

    if (userData) {
      const passwordExisting = userData.password;
      const isPasswordValid = await bcrypt.compare(password, passwordExisting);

      if (isPasswordValid) {
        let newToken = token;

        if (newToken === "no-token") {
          newToken = jwt.sign({ userId: userData._id }, secret_id, {
            expiresIn: "1h",
          });
        }

        res.json({
          success: true,
          token: newToken,
          user: {
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            learnings: userData.learnings,
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

// Update User
router.post("/updateUser", async (req, res) => {
  try {
    const { email, newLearningEnrollment } = req.body;
    if (!email || !newLearningEnrollment) {
      res.json({
        success: false,
        error: "Email and LearningEnrollments are Required !",
      });
    }
    const savedUser = await User.findOne({ email });

    if (savedUser) {
      if (savedUser.learnings.includes(newLearningEnrollment)) {
        return res.json({
          success: false,
          message: "Learning Enrollment already exists for this user!",
        });
      }
      savedUser.learnings.push(newLearningEnrollment);

      await savedUser.save();

      res.json({ success: true, message: "User Updated Successfully !" });
    } else {
      res.json({ success: false, message: "User Not Found !" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
