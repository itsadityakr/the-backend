// constants.js — Centralized magic values used across the app

// Max upload size: 5MB (5 * 1024 * 1024 bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image MIME types for file uploads
const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

// Standard HTTP status codes for API responses
const HTTP_STATUS = {
    OK: 200, // Request succeeded
    CREATED: 201, // New resource created
    BAD_REQUEST: 400, // Client sent invalid data
    NOT_FOUND: 404, // Resource doesn't exist
    INTERNAL_SERVER: 500, // Server error
};

// Default server port if PORT env var is not set
const DEFAULT_PORT = 3000;

module.exports = {
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
    HTTP_STATUS,
    DEFAULT_PORT,
};
