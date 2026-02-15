// post.model.js — Mongoose schema defining the Post data structure in MongoDB

const mongoose = require("mongoose");

// Define the Post schema with required fields and auto timestamps
const postSchema = new mongoose.Schema(
    {
        image: { type: String, required: true, trim: true }, // URL of uploaded image
        caption: { type: String, required: true, trim: true }, // Post caption text
    },
    {
        timestamps: true, // Auto-adds createdAt and updatedAt fields
    },
);

// Create and export the model — maps to "posts" collection in MongoDB
const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;
