// app.js — Express application setup: middleware, routes, and error handling

const express = require("express");
require("dotenv").config(); // Load .env vars into process.env (must be early)
const cors = require("cors"); // Allows frontend on different port to call API

const postRoutes = require("./routes/post.routes"); // Post API routes
const globalErrorHandler = require("./middlewares/error.middleware"); // Catches all errors
const { HTTP_STATUS } = require("./config/constants");

const app = express();

// --- Global Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Server is healthy and running ",
        timestamp: new Date().toISOString(),
    });
});

// Mount post routes at /api prefix (e.g., /api/create-post, /api/post)
app.use("/api", postRoutes);

// 404 handler — runs when no route matched the request
app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global error handler — must be LAST middleware
app.use(globalErrorHandler);

module.exports = app;
