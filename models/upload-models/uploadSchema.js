const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for file uploads
const uploadSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    contentType: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    metadata: {
        // Add any other fields you need here
    }
}, { strict: false });

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
