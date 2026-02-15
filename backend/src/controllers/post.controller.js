// post.controller.js — Business logic for post-related API endpoints

const postModel = require("../models/post.model"); // Mongoose model for DB operations
const uploadFile = require("../services/storage.service"); // ImageKit upload function
const { HTTP_STATUS } = require("../config/constants"); // Readable HTTP status codes

// POST /api/create-post — Upload image + save post to database
const createPost = async (req, res, next) => {
    try {
        // Validate image file was uploaded
        if (!req.file) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Image file is required. Please upload an image.",
            });
        }

        // Validate caption is not empty
        if (!req.body.caption || !req.body.caption.trim()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Caption is required. Please enter a caption.",
            });
        }

        // Upload image to ImageKit and get the URL back
        const result = await uploadFile(req.file.buffer);

        // Save post to MongoDB with image URL and trimmed caption
        const post = await postModel.create({
            image: result.url,
            caption: req.body.caption.trim(),
        });

        // Respond with 201 Created
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

// GET /api/post — Fetch all posts, newest first
const getPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Posts fetched successfully",
            count: posts.length,
            posts,
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

module.exports = { createPost, getPosts };
