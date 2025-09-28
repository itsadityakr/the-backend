// Load environment variables from a .env file into process.env
require("dotenv").config();

// Uncomment the line below if you want to see all environment variables in the terminal
// console.log(process.env)

// Import the Express library (a minimal and flexible Node.js web application framework)
const express = require("express"); // CommonJS syntax for importing modules

// Create an instance of the Express app
const app = express();

// Create a simple JavaScript object that looks like GitHub user data
// This is mock data we're going to send as a response when someone visits our app
const githubUserData = {
    login: "itsadityakr", // GitHub username
    id: 2711, // User ID (just a mock number)
    html_url: "https://github.com/itsadityakr", // Link to the GitHub profile
    type: "User", // Type of account
    user_view_type: "public", // Visibility of the account
    name: "Aditya Kumar", // Full name of the user
};

// Define a route for the root URL ("/")
// When someone visits http://localhost:PORT/, this function runs
// It sends the githubUserData object as a JSON response
app.get("/", (req, res) => {
    res.json(githubUserData); // Send the data as a JSON response
});

// Start the server and have it listen on the port defined in the .env file
// process.env.PORT gets the PORT number from your .env file
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
    // Example: if PORT is 3000, the message will be: Example app listening on port 3000
});
