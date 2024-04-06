const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    doubtId: {
        type: String,
        required: true,
        unique: true,
    },
    doubt: {
        type: String,
        required: true,
    },
    isSolved: {
        type: Boolean,
        default: false,
    },
    solution: {
        type: String,
        default: "Solution not provided yet",
    },
      
});

const Doubt = mongoose.model('doubts', doubtSchema);


module.exports = Doubt;