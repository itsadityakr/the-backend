const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect(
        "mongodb+srv://adityakr27:MGi9xpZsOymHouEW@the-backend.yqwqsvn.mongodb.net/halley",
    );

    console.log("Database Connected");
}

module.exports = connectDB;
