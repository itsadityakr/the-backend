// storage.service.js — Uploads images to ImageKit cloud storage

const { ImageKit } = require("@imagekit/nodejs"); // ImageKit SDK for file uploads

// Create ImageKit client with private key from .env
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Upload file buffer to ImageKit, returns object with .url property
async function uploadFile(buffer) {
    try {
        // Generate a unique filename using timestamp to prevent overwrites
        const uniqueFileName = `image_${Date.now()}.jpg`;

        // Convert buffer to base64 (required by ImageKit) and upload
        const result = await client.files.upload({
            file: buffer.toString("base64"),
            fileName: uniqueFileName,
        });

        return result;
    } catch (error) {
        console.error(" ImageKit upload failed:", error.message);
        throw new Error(`Failed to upload image to storage: ${error.message}`);
    }
}

module.exports = uploadFile;
