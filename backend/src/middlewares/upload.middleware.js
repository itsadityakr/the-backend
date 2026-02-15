// upload.middleware.js — Multer config for handling file uploads with validation

const multer = require("multer");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config/constants");

// Only accept image files — reject everything else
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image files are allowed!"), false); // Reject
    }
};

// Configure multer: memory storage, 5MB limit, image-only filter
const upload = multer({
    storage: multer.memoryStorage(), // Store file in RAM as a Buffer
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});

module.exports = upload;
