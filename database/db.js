const mongoose = require('mongoose');
 
const mongouri = process.env.MONGO_URI;

const mongodb = async ()=>{
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongouri);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log(e);
    }
}

module.exports = mongodb;