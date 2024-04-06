const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const secret_id = process.env.SECRET_ID;
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const Doubt = require("../../models/user-models/doubts");

router.post("/addDoubt", async (req, res) => {
  const { doubt } = req.body;
  if (!doubt) {
    return res.json({ success: false, error: "Please fill all the fields" });
  }

  try {
   
    const udoubtId = uuid.v4();

    let existingDoubt = await Doubt.findOne({ doubt: doubt });
    if (existingDoubt) {
      return res.json({
        success: false,
        error: "Doubt already exists",
        _id: existingDoubt.doubtId,
      });
    }

    let doubtData = await Doubt.create({
      doubtId: udoubtId,
      doubt: doubt,
    });
    res.json({ success: true, _id: doubtData.doubtId });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/findDoubtById", async (req, res) => {
  const { doubtId } = req.query;
  if (!doubtId) {
    return res.json({ success: false, error: "Please fill all the fields" });
  }

  try {
    let existingDoubt = await Doubt.findOne({ doubtId: doubtId });
    if (existingDoubt) {
      return res.json({
        success: true,
        doubtId: existingDoubt.doubtId,
        doubt: existingDoubt.doubt,
        isSolved: existingDoubt.isSolved,
        solution: existingDoubt.solution,
      });
    }

    res.json({
      success: false,
      error: "Doubt Not Found !! Please add new one",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/findDoubtsByKeyword", async (req, res) => {
  const { doubtKeyword } = req.query; // Access query parameters using req.query
  if (!doubtKeyword) {
    return res.json({
      success: false,
      error: "Please provide a doubt keyword",
    });
  }

  try {
    let existingDoubts = await Doubt.find({
      doubt: { $regex: ".*" + doubtKeyword + ".*", $options: "i" },
    });
    if (existingDoubts && existingDoubts.length > 0) {
      return res.json({
        success: true,
        doubts: existingDoubts.map((doubt) => ({
          doubtId: doubt.doubtId,
          doubt: doubt.doubt,
          isSolved: doubt.isSolved,
          solution: doubt.solution,
        })),
      });
    } else {
      return res.json({
        success: false,
        error: "No doubts found with the provided keyword",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.put("/updateDoubtSolution", async (req, res) => {
  const { doubtId, solution } = req.body;
  if (!doubtId || !solution) {
    return res.json({ success: false, error: "Please fill all the fields" });
  }

  try {
    let existingDoubt = await Doubt.findOne({ doubtId: doubtId });
    if (existingDoubt) {
      let updatedDoubt = await Doubt.findOneAndUpdate(
        { doubtId: doubtId },
        { solution: solution, isSolved: true },
        { new: true }
      );
      return res.json({
        success: true,
        doubtId: updatedDoubt.doubtId,
        doubt: updatedDoubt.doubt,
        isSolved: updatedDoubt.isSolved,
        solution: updatedDoubt.solution,
      });
    }

    res.json({
      success: false,
      error: "Doubt Not Found !! Please add new one",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/getAllDoubts",async (req,res)=>{
  try{
    const doubts = await Doubt.find();
    res.json({success:true,doubts});
  }catch(error){
    console.log(error);
    res.json({success:false,error:"Internal Server Error"});
  }
})

module.exports = router;
