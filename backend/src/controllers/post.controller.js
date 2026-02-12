/**
 * post.controller.js — Post Controller (Request Handlers)
 *
 * WHAT is a Controller?
 *   A controller contains the LOGIC that runs when a user hits an API
 *   endpoint. It receives the request (req), does something with it
 *   (like saving to the database), and sends back a response (res).
 *
 *   Think of it like a waiter in a restaurant:
 *     - The ROUTE tells the waiter which table to go to (which URL)
 *     - The CONTROLLER is the waiter doing the actual work
 *       (taking the order, bringing food, etc.)
 *
 * WHY is this file in the controllers/ folder?
 *   The `controllers/` folder holds ALL the business logic for handling
 *   requests. By separating controllers from routes:
 *     - Routes stay clean (just URL → function mapping)
 *     - Logic is reusable (same controller can be used by different routes)
 *     - Easier to test (you can test the logic without setting up routes)
 *     - Each controller file handles one "resource" (e.g., posts, users)
 *
 * NAMING CONVENTION:
 *   Files are named as `<entity>.controller.js` (e.g., post.controller.js,
 *   user.controller.js).
 *
 * WHAT does this file do?
 *   1. Imports the Post model (to interact with the database)
 *   2. Imports the file upload service (to upload images to ImageKit)
 *   3. Defines handler functions for each post-related endpoint
 *   4. Exports those functions so routes can use them
 */

// Import the Post model to interact with the "posts" collection in MongoDB
const postModel = require("../models/post.model");

// Import the file upload function from the storage service
const uploadFile = require("../services/storage.service");

/**
 * createPost — Handles POST /create-post
 *
 * What it does:
 *   1. Takes the uploaded image file from the request (req.file)
 *   2. Uploads the image buffer to ImageKit using the storage service
 *   3. Creates a new post in MongoDB with the image URL and caption
 *   4. Sends back a 201 (Created) response with the new post data
 *
 * @param {Object} req - Express request object (contains file and body)
 * @param {Object} res - Express response object (used to send response)
 */
const createPost = async (req, res) => {
    try {
        // Upload the image file buffer to ImageKit and get the result (includes URL)
        const result = await uploadFile(req.file.buffer);

        // Create a new post document in MongoDB with the image URL and caption
        const post = await postModel.create({
            image: result.url, // The public URL of the uploaded image
            caption: req.body.caption, // The caption text from the request body
        });

        // Send a success response with HTTP status 201 (Created)
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        // If anything goes wrong, send a 500 (Internal Server Error) response
        res.status(500).json({
            message: "Error creating post",
            error: error.message,
        });
    }
};

/**
 * getPosts — Handles GET /post
 *
 * What it does:
 *   1. Fetches ALL posts from the MongoDB "posts" collection
 *   2. Sends them back as a JSON array in the response
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPosts = async (req, res) => {
    try {
        // Fetch all post documents from the database
        const posts = await postModel.find();

        // Send a success response with the posts array
        res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        // If anything goes wrong, send a 500 error response
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message,
        });
    }
};

// Export the controller functions so route files can use them
module.exports = { createPost, getPosts };
