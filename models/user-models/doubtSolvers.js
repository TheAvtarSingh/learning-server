const mongoose = require('mongoose');

const doubtSolverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phoneNumber: {
        type: Number, 
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      numberOfDoubtsSolved: {
        type: Number,
        default: 0,
      },
        doubtsSolved: {
            type: Array,
            default: [],
        },

});

module.exports = mongoose.model('doubtSolver', doubtSolverSchema);