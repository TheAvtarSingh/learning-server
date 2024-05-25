const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

router.post("/compile-java",async (req,res)=>{
    const { files } = req.body;
    const compiler_key = process.env.COMPILER_KEY;

  // Validate the request body
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.json({ success: false, error: "Files array is required and cannot be empty" });
  }

  for (const file of files) {
    if (!file.name || !file.content) {
      return res.json({ success: false, error: "Each file must have a name and content" });
    }
  }
  

  const payload = {
    files: files,
  };
  try {
    const response = await axios.post('https://glot.io/api/run/java/latest', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${compiler_key}`
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success:false,error: 'An error occurred while forwarding the request.' });
  }
})

module.exports = router;