/**
 * server.js — Entry Point of the Application
 *
 * This is the very first file that runs when you start the app.
 * It has only two jobs:
 *   1. Connect to the database
 *   2. Start the HTTP server and listen for incoming requests
 *
 * WHY is this file at the root?
 *   Because it's the "main" file defined in package.json.
 *   When you run `npm start` or `npm run dev`, Node.js executes this file.
 *   It sits at the root so it's easy to find — it's the front door of your app.
 *
 * WHY is app setup separate from server startup?
 *   Separating `app.js` (Express config) from `server.js` (server startup)
 *   makes testing easier — you can import `app` in tests without starting
 *   an actual server.
 */

// Import the configured Express application from src/app.js
const app = require("./src/app");

// Import the database connection function from src/config/db.js
const connectDB = require("./src/config/db");

// Use the PORT from .env file, or fall back to 3001 if not set
const PORT = process.env.PORT || 3001;

// Connect to MongoDB before starting the server
connectDB();

// Start listening for HTTP requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
