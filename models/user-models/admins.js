const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
      
});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;