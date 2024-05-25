const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), (req, res) => {
    res.json({ file: req.file });
});


module.exports = router;