/**
 * post.routes.js — Post Route Definitions
 *
 * WHAT is a Route?
 *   A route maps a URL path + HTTP method to a function that handles it.
 *   For example:
 *     POST /create-post  →  createPost controller function
 *     GET  /post          →  getPosts controller function
 *
 *   Think of routes as a phone directory:
 *     - The URL is the phone number
 *     - The controller function is the person who answers
 *
 * WHAT is Express Router?
 *   Express Router is a mini-app that only handles routes. You define
 *   routes on it, then "mount" it in app.js. This lets you group
 *   related routes together in separate files.
 *
 * WHY is this file in the routes/ folder?
 *   The `routes/` folder contains ALL route definitions for your API.
 *   Each file handles routes for one resource (e.g., posts, users).
 *   By separating routes from controllers:
 *     - You can see ALL your API endpoints in one place
 *     - Route files are short and readable (just URL → function mapping)
 *     - Adding a new endpoint = one line in the route file
 *     - The actual logic lives in the controller (separation of concerns)
 *
 * NAMING CONVENTION:
 *   Files are named as `<entity>.routes.js` (e.g., post.routes.js,
 *   user.routes.js).
 *
 * HOW does a request flow through the app?
 *   1. User sends: POST /create-post with an image file
 *   2. server.js receives it → passes to app.js
 *   3. app.js matches the URL → sends to post.routes.js
 *   4. post.routes.js runs middleware (upload.single) → then controller (createPost)
 *   5. Controller does the work and sends back a response
 */

const express = require("express");

// Create a new Router instance (a mini-app for defining routes)
const router = express.Router();

// Import the upload middleware for handling file uploads
const upload = require("../middlewares/upload.middleware");

// Import controller functions that contain the actual logic
const { createPost, getPosts } = require("../controllers/post.controller");

/**
 * POST /create-post
 * - upload.single("image") → Middleware: parse the uploaded file from the "image" field
 * - createPost → Controller: upload to ImageKit, save to DB, send response
 */
router.post("/create-post", upload.single("image"), createPost);

/**
 * GET /post
 * - getPosts → Controller: fetch all posts from DB and send response
 */
router.get("/post", getPosts);

// Export the router so app.js can mount it
module.exports = router;
