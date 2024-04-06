const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const secret_id = process.env.SECRET_ID;
const jwt = require("jsonwebtoken");
const DoubtSolver = require("../../models/user-models/doubtSolvers");

router.post("/registerDoubtSolver", async (req, res) => {
  const { email, password, phoneNumber, age, name } = req.body;
  if (!email || !password || !phoneNumber || !age || !name) {
    return res.json({ success: false, error: "Please fill all the fields" });
  }
  const salt = await bcrypt.genSalt(10);
  let secPassword = await bcrypt.hash(password, salt);

  try {
    let doubtSolverData = await DoubtSolver.findOne({ email });
    if (!doubtSolverData) {
      // let courseHeadings = availableCourses.map(course => course.heading);
      let addedData = await DoubtSolver.create({
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
        error: "DoubtSolver with Same Email Already Exists !",
      });
    }
  } catch (error) {
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/loginDoubtSolver", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const doubtSolverData = await DoubtSolver.findOne({ email });
    if (doubtSolverData) {
      const passwordExisting = doubtSolverData.password;
      const isMatch = await bcrypt.compare(password, passwordExisting);
      if (isMatch) {
        const token = jwt.sign({ id: doubtSolverData._id }, secret_id);
        res.json({
          success: true,
          token: token,
          user: {
            name: doubtSolverData.name,
            email: doubtSolverData.email,
            phoneNumber: doubtSolverData.phoneNumber,
            age: doubtSolverData.age,
            numberOfDoubtsSolved: doubtSolverData.numberOfDoubtsSolved,
            doubtsSolved: doubtSolverData.doubtsSolved,
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

// Add number of doubts solved and doubts solved by doubt solver
router.post("/addDoubtSolved", async (req, res) => {
  try {
    const { email, doubtId } = req.body;
    if (!email || !doubtId) {
      return res.json({ success: false, error: "Please fill all the fields" });
    }
    const doubtSolverData = await DoubtSolver.findOne({ email });
    if (doubtSolverData) {

        // find if the doubt is already solved by the user
        const isDoubtSolved = doubtSolverData.doubtsSolved.includes(doubtId);
        if (isDoubtSolved) {
          return res.json({ success: false, error: "Doubt already solved by same user" });
        }

        const updatedDoubtsSolved = await DoubtSolver.findOneAndUpdate(
            { email: email },
            {
              $push: { doubtsSolved: doubtId },
              $inc: { numberOfDoubtsSolved: 1 },
            },
            { new: true }
          );
      res.json({ success: true, updatedDoubtsSolved });
    } else {
      res.json({ success: false, error: "User not found !" });
    }
    } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Internal Server Error" });
    }
    });

module.exports = router;
