const mongoose = require("mongoose");

const Conversation = mongoose.Schema({
   user: {
      type: String
   },
   doubtSolver:{
        type: String
    
   }
});

module.exports = mongoose.model("Conversation", Conversation);