// db.js — MongoDB connection setup using Mongoose

const mongoose = require("mongoose");

// Log connection events for visibility
mongoose.connection.on("connected", () => {
    console.log(" Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error(" Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("️  Mongoose disconnected from MongoDB");
});

// Connect to MongoDB — exits process on failure since app can't work without DB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(" Database Connected Successfully");
    } catch (error) {
        console.error(" Database Connection Failed:", error.message);
        process.exit(1);
    }
}

// Export connectDB to call at startup, and mongoose for graceful shutdown
module.exports = { connectDB, mongoose };
