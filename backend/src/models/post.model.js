/**
 * post.model.js — Post Data Model (Mongoose Schema)
 *
 * WHAT is a Model?
 *   A model defines the STRUCTURE of your data in the database.
 *   Think of it as a blueprint or template. It tells MongoDB:
 *     - What fields each document (record) should have
 *     - What data type each field should be (String, Number, etc.)
 *     - Any validation rules (required, min length, etc.)
 *
 *   For example, this Post model says: "Every post in the database
 *   must have an `image` (string) and a `caption` (string)."
 *
 * WHAT is a Schema?
 *   A schema is the Mongoose way of defining the model's structure.
 *   It maps to a MongoDB collection. When you create a model from a
 *   schema, Mongoose creates (or connects to) a collection named
 *   after the model (e.g., "Post" → "posts" collection in MongoDB).
 *
 * WHY is this file in the models/ folder?
 *   The `models/` folder contains ALL data models (schemas) for your app.
 *   Each file represents one collection in the database. By keeping
 *   models in their own folder:
 *     - You can easily find and manage your data structures
 *     - Controllers and services can import models as needed
 *     - Adding a new collection = adding a new file here
 *
 * NAMING CONVENTION:
 *   Files are named as `<entity>.model.js` (e.g., post.model.js,
 *   user.model.js) so you can immediately tell it's a model file.
 */

const mongoose = require("mongoose");

// Define the schema (structure) for a Post document
const postSchema = new mongoose.Schema({
    image: String, // URL of the uploaded image (stored on ImageKit)
    caption: String, // Text caption for the post
});

// Create the model from the schema
// "Post" → Mongoose will create/use a MongoDB collection called "posts"
const postModel = mongoose.model("Post", postSchema);

// Export so controllers can use it to create, read, update, delete posts
module.exports = postModel;
