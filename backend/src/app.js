/**
 * app.js — Express Application Setup
 *
 * This file creates and configures the Express application.
 * It is the "brain" of your server — it decides:
 *   - What middleware to use (e.g., JSON parsing)
 *   - Which route files handle which URL paths
 *
 * WHY is this file in src/?
 *   The `src/` folder holds ALL your source code. This file is the
 *   main hub that ties together routes, middlewares, and config.
 *   It lives at the top level of `src/` because it's the central
 *   piece that everything else plugs into.
 *
 * WHY is this separate from server.js?
 *   By separating the Express "app" from the "server" (which listens
 *   on a port), we can import this app into test files without
 *   actually starting a real server. This is a common best practice.
 *
 * WHAT does this file do?
 *   1. Loads environment variables from the .env file
 *   2. Creates an Express app instance
 *   3. Adds global middleware (like JSON body parsing)
 *   4. Mounts route files (each route file handles a group of endpoints)
 *   5. Exports the app so server.js can start it
 */

const express = require("express");

// Load environment variables from .env file into process.env
// This must be called early so all other files can access env vars
require("dotenv").config();

// Import route definitions
const postRoutes = require("./routes/post.routes");

// Create the Express application
const app = express();

// --- Global Middleware ---

// Parse incoming JSON request bodies (e.g., { "caption": "Hello" })
// Without this, req.body would be undefined for JSON requests
app.use(express.json());

// --- Route Mounting ---
// Mount post routes at the root path "/"
// This means all routes defined in post.routes.js will be accessible
// directly, e.g., POST /create-post, GET /post
app.use("/", postRoutes);

// Export the app so server.js can use it
module.exports = app;
