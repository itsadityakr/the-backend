/**
 * storage.service.js — Image Storage Service (ImageKit Integration)
 *
 * WHAT is a Service?
 *   A service is a module that handles interaction with an EXTERNAL system
 *   (a third-party API, a file system, an email provider, etc.).
 *   Services contain the technical details of HOW to talk to these systems,
 *   so the rest of your app doesn't need to know.
 *
 *   For example, this service handles uploading files to ImageKit.
 *   Your controller just calls `uploadFile(buffer)` and gets back a URL —
 *   it doesn't need to know anything about ImageKit's API.
 *
 * WHAT is ImageKit?
 *   ImageKit is a cloud-based image storage and delivery service.
 *   Instead of storing images on your own server, you upload them to
 *   ImageKit and get back a URL. Benefits:
 *     - Images are served from a fast CDN (Content Delivery Network)
 *     - Automatic image optimization and transformations
 *     - Your server doesn't need to store/serve large files
 *
 * WHY is this file in the services/ folder?
 *   The `services/` folder contains ALL external service integrations.
 *   Each file handles one external service. By isolating services:
 *     - If you switch from ImageKit to AWS S3, you only change this file
 *     - Controllers stay clean (they just call the service function)
 *     - Easy to mock services in tests
 *     - Each service file is focused on one responsibility
 *
 * NAMING CONVENTION:
 *   Files are named as `<service-name>.service.js` (e.g., storage.service.js,
 *   email.service.js, payment.service.js).
 */

const { ImageKit } = require("@imagekit/nodejs");

// Create an ImageKit client instance using the private key from .env
// This client is used to authenticate and make API calls to ImageKit
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * uploadFile — Uploads a file buffer to ImageKit
 *
 * @param {Buffer} buffer - The raw file data (from multer's memory storage)
 * @returns {Object} result - ImageKit upload response containing:
 *   - result.url: The public URL of the uploaded image
 *   - result.fileId: Unique identifier for the file on ImageKit
 *   - result.name: The filename on ImageKit
 *
 * How it works:
 *   1. Converts the binary buffer to a base64 string (ImageKit requires this)
 *   2. Sends the base64 string to ImageKit's upload API
 *   3. Returns the response which includes the public URL
 */
async function uploadFile(buffer) {
    const result = await client.files.upload({
        file: buffer.toString("base64"), // Convert binary data to base64 string
        fileName: "image.jpg", // Default filename on ImageKit
    });

    return result;
}

// Export the upload function so controllers can use it
module.exports = uploadFile;
