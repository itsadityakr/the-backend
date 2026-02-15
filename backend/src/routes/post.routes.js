// post.routes.js — Defines API endpoints for post operations

const express = require("express");
const router = express.Router(); // Mini-router for grouping routes
const upload = require("../middlewares/upload.middleware"); // Multer file upload middleware
const { createPost, getPosts } = require("../controllers/post.controller"); // Controller functions

// POST /api/create-post — Upload image via multer, then run createPost controller
router.post("/create-post", upload.single("image"), createPost);

// GET /api/post — Fetch all posts from database
router.get("/post", getPosts);

module.exports = router;
