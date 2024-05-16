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
  const { email, password, phoneNumber, age, name ,paymentsMade} = req.body;
  if (!email || !password || !phoneNumber || !age || !name || !paymentsMade) {
    return res.json({ success: false, error: "Please fill all the fields" });
  }
 
  const salt = await bcrypt.genSalt(10);
  let secPassword = await bcrypt.hash(password, salt);

  try {
    let userData = await User.findOne({ email });
    if (!userData) {
      // let courseHeadings = availableCourses.map(course => course.heading);
      let addedData = await User.create({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        age: age,
        password: secPassword,
        paymentsMade:paymentsMade,
       successCredits:30
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

router.get("/getAllUsers",async (req,res)=>{
  try{
    const users = await User.find();
    res.json({success:true,users});
  }catch(error){
    console.log(error);
    res.json({success:false,error:"Internal Server Error"});
  }
})

router.get("/findUserInfo", async (req, res) => {
  try {
    const { email } = req.query;
    if(!email) return res.json({ success: false, message: "Email is Required !" });
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

router.get("/findUserPayments", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json({ success: false, message: "Email is required!" });
    }

    const userData = await User.findOne({ email });
    if (userData) {
      res.json({ success: true, paymentsMade: userData.paymentsMade });
    } else {
      res.json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error(error);
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
            coursesEnrolled: userData.coursesEnrolled,
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
    const { email, courseHeading } = req.body;
    if (!email || !courseHeading) {
      return res.json({
        success: false,
        error: "Email and Course Heading are required!",
      });
    }

    const savedUser = await User.findOne({ email });

    if (savedUser) {
      console.log("Before save:", savedUser);
      const courseIndex = savedUser.learnings.findIndex(
        (course) => course.heading === courseHeading
      );

      if (courseIndex !== -1) {
        if (savedUser.learnings[courseIndex].isEnrolled) {
          return res.json({
            success: false,
            message: "Course is already enrolled for this user!",
          });
        }
        savedUser.learnings[courseIndex].isEnrolled = true;
        // Add this log

        await savedUser.save().then((data)=>console.log(data));

      
        return res.json({
          success: true,
          message: "Course enrollment updated successfully!",
        });
      } else {
        return res.json({
          success: false,
          message: "Course not found in user's learnings!",
        });
      }
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});
router.put("/updateCoursesEnrolled", async (req, res) => {
  try {
    const { email, courseHeading } = req.body;
    if (!email || !courseHeading) {
      return res.json({
        success: false,
        error: "Email and Course Heading are required!",
      });
    }

    const savedUser = await User.findOne({ email });

    if (savedUser) {
      // Check if newLearningEnrollment already exists in the learnings array
      if (savedUser.coursesEnrolled.includes(courseHeading)) {
        return res.json({ success: false, message: "Learning Enrollment already exists for this user!" });
      }
      
      // Push the new learning enrollment to the existing learnings array
      savedUser.coursesEnrolled.push(courseHeading);
      
      // Save the updated user
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
router.put("/updateSuccessCredits", async (req, res) => {
  try {
    const { email, successCredits } = req.body;
    if (!email || successCredits === undefined) {
      return res.json({
        success: false,
        error: "Email and successCredits are required!",
      });
    }

    const savedUser = await User.findOne({ email });

    if (savedUser) {
      savedUser.successCredits = successCredits;
      await savedUser.save();

      res.json({ success: true, message: "Success credits updated successfully!" });
    } else {
      res.json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});
router.put("/updatePaymentsMade", async (req, res) => {
  try {
    const { email, payment } = req.body;
    if (!email || payment === undefined) {
      return res.json({
        success: false,
        error: "Email and payment are required!",
      });
    }

    const savedUser = await User.findOne({ email });

    if (savedUser) {
      savedUser.paymentsMade.push(payment); 
      await savedUser.save();

      res.json({ success: true, message: "Payment Details updated successfully!" });
    } else {
      res.json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;
