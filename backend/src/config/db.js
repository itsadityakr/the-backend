/**
 * db.js — Database Connection Configuration
 *
 * This file handles connecting to MongoDB using Mongoose.
 *
 * WHAT is Mongoose?
 *   Mongoose is an ODM (Object Data Modeling) library for MongoDB.
 *   It provides a structured way to define schemas, validate data,
 *   and interact with MongoDB using JavaScript objects instead of
 *   raw database queries.
 *
 * WHY is this file in the config/ folder?
 *   The `config/` folder stores configuration and setup files —
 *   things that configure HOW your app connects to external services
 *   (databases, APIs, etc.). The database connection is a configuration
 *   concern, not business logic, so it belongs here.
 *
 * WHAT does this file do?
 *   1. Imports Mongoose
 *   2. Defines an async function that connects to MongoDB
 *   3. Uses the connection string from the .env file (MONGODB_URI)
 *   4. Logs success or error messages
 *   5. Exports the function so server.js can call it at startup
 */

const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database.
 * Called once at server startup in server.js.
 * The connection string is read from the MONGODB_URI environment variable.
 */
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;
