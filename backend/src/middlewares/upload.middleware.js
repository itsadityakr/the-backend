/**
 * upload.middleware.js — File Upload Middleware (Multer Configuration)
 *
 * WHAT is Middleware?
 *   Middleware is a function that runs BETWEEN receiving a request and
 *   sending a response. It can modify the request, add data to it,
 *   reject it, or pass it along to the next function.
 *
 *   Think of it like airport security — before you board the plane
 *   (reach the controller), you pass through security checks (middleware).
 *
 * WHAT is Multer?
 *   Multer is a middleware for handling file uploads. When a user sends
 *   a file (like an image) via a form, Multer:
 *     - Reads the file from the request
 *     - Stores it (in memory or on disk)
 *     - Attaches it to `req.file` so your controller can access it
 *
 * WHAT is Memory Storage?
 *   `multer.memoryStorage()` means the uploaded file is kept in RAM
 *   (as a Buffer) instead of being saved to disk. This is useful when
 *   you plan to immediately forward the file somewhere else (like
 *   uploading to ImageKit) and don't need a local copy.
 *
 * WHY is this file in the middlewares/ folder?
 *   The `middlewares/` folder contains all reusable middleware functions.
 *   File upload handling is a middleware concern — it processes the
 *   request before it reaches the controller. By keeping it here:
 *     - Routes stay clean (just reference the middleware)
 *     - The upload config is reusable across multiple routes
 *     - Easy to swap storage strategy (memory → disk) in one place
 *
 * HOW is this used?
 *   In a route file: `router.post("/upload", upload.single("image"), controller)`
 *   - `upload.single("image")` means: expect one file in a form field called "image"
 *   - After this middleware runs, the file is available as `req.file`
 */

const multer = require("multer");

// Create a multer instance with memory storage
// Files will be stored as Buffers in memory (req.file.buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Export the configured multer instance
// Usage in routes: upload.single("fieldName") for single file uploads
module.exports = upload;
