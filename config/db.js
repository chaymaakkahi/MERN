const mongoose = require("mongoose");
async function connectDB(uri) {
    if (!uri){
        throw new Error("MongoDB URI is not defined in the environment variables.");
    }
    await mongoose.connect(uri, {
        autoIndex: true,
    });
     console.log("MongoDB connected successfully");
}
module.exports = connectDB;