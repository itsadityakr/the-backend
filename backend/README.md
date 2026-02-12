# The Backend

A RESTful API built with **Express.js**, **MongoDB**, and **ImageKit** for creating and fetching posts with image uploads.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
    - [POST /create-post](#post-create-post)
    - [GET /post](#get-post)
- [Project Structure](#project-structure)
- [Folder Explanations](#folder-explanations)
- [Code Walkthrough — File by File](#code-walkthrough--file-by-file)
    - [package.json](#1-packagejson--project-configuration)
    - [.env / .env.example](#2-env--environment-variables)
    - [server.js](#3-serverjs--entry-point)
    - [src/app.js](#4-srcappjs--express-application-setup)
    - [src/config/db.js](#5-srcconfigdbjs--database-connection)
    - [src/models/post.model.js](#6-srcmodelspostmodeljs--data-schema)
    - [src/services/storage.service.js](#7-srcservicesstorageservicejs--imagekit-upload)
    - [src/middlewares/upload.middleware.js](#8-srcmiddlewaresuploadmiddlewarejs--file-upload-handler)
    - [src/routes/post.routes.js](#9-srcroutespostroutesjs--route-definitions)
    - [src/controllers/post.controller.js](#10-srccontrollerspostcontrollerjs--request-handlers)
- [How a Request Flows Through the App](#how-a-request-flows-through-the-app)
- [Key Concepts for Beginners](#key-concepts-for-beginners)
- [How to Add a New Feature](#how-to-add-a-new-feature)

---

## Tech Stack

| Technology     | What It Is                                                                          | Why We Use It                                                             |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Node.js**    | A JavaScript runtime that lets you run JavaScript outside the browser, on a server. | Powers our backend server.                                                |
| **Express.js** | A minimal web framework for Node.js that handles HTTP requests and routing.         | Makes it easy to create API endpoints (URLs that respond to requests).    |
| **MongoDB**    | A NoSQL database that stores data as JSON-like documents (not tables like SQL).     | Stores our posts (image URLs and captions).                               |
| **Mongoose**   | An ODM (Object Data Modeling) library — gives MongoDB a structured schema system.   | Lets us define what a "Post" looks like and validate data before saving.  |
| **ImageKit**   | A cloud image storage and CDN service — stores images and serves them fast.         | We upload images here instead of storing them on our own server.          |
| **Multer**     | Express middleware that handles `multipart/form-data` (file uploads).               | Reads uploaded files from HTTP requests and makes them available in code. |
| **dotenv**     | Loads environment variables from a `.env` file into `process.env`.                  | Keeps secrets (database passwords, API keys) out of your code.            |
| **nodemon**    | A dev tool that auto-restarts the server whenever you save a file.                  | Speeds up development — no need to manually restart after every change.   |

---

## Prerequisites

Before you start, make sure you have:

1. **Node.js** (v18 or later) — [Download here](https://nodejs.org/)
    - Node.js lets you run JavaScript on your computer (outside a browser).
    - Comes with **npm** (Node Package Manager) which installs libraries.

2. **MongoDB Database** — Either:
    - A free cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended for beginners), OR
    - MongoDB installed locally on your machine.

3. **ImageKit Account** — [Sign up free](https://imagekit.io/)
    - You'll need the **Private Key** from your ImageKit dashboard.

---

## Installation

```bash
# 1. Clone the repository (download the code)
git clone https://github.com/itsadityakr/the-backend.git

# 2. Navigate into the backend folder
cd the-backend/backend

# 3. Install all dependencies (libraries this project uses)
#    This reads package.json and downloads everything listed in "dependencies"
npm install
```

**What `npm install` does:**

- Reads the `package.json` file
- Downloads all the packages listed under `"dependencies"` and `"devDependencies"`
- Puts them in a `node_modules/` folder
- Creates/updates `package-lock.json` (locks exact versions)

---

## Configuration

### Step 1: Create your `.env` file

```bash
# Copy the example file to create your own .env
cp .env.example .env
```

### Step 2: Fill in your values

Open `.env` and replace the placeholder values:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

| Variable               | What It Is                                                                                                                | Where to Get It                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `PORT`                 | The port number your server runs on. Default is `3000`, meaning the server is at `http://localhost:3000`.                 | You can choose any port (3000, 5000, 8080, etc.).                   |
| `MONGODB_URI`          | The connection string for your MongoDB database. Looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname` | From MongoDB Atlas dashboard → Connect → Drivers → copy the string. |
| `IMAGEKIT_PRIVATE_KEY` | Your secret ImageKit API key. Used to authenticate uploads. Looks like: `private_abc123xyz=`                              | From ImageKit dashboard → Developer Options → API Keys.             |

> **⚠️ IMPORTANT:** Never commit your `.env` file to Git! It contains secrets. The `.gitignore` file already excludes it.

---

## Running the Server

```bash
# Development mode — auto-restarts when you save changes (uses nodemon)
npm run dev

# Production mode — runs once, no auto-restart
npm start
```

**Expected output:**

```
Server is running on http://localhost:3000
Database Connected
```

If you see `Database Connected`, your MongoDB connection is working. If you see an error instead, double-check your `MONGODB_URI` in `.env`.

---

## API Endpoints

This API has **2 endpoints** (URLs that accept requests):

---

### POST /create-post

**Purpose:** Upload an image and create a new post.

**HTTP Method:** `POST`

**URL:** `http://localhost:3000/create-post`

**Request Format:** `multipart/form-data` (this is the format used for file uploads)

**Request Fields:**

| Field     | Type | Required | Description                               |
| --------- | ---- | -------- | ----------------------------------------- |
| `image`   | File | Yes      | The image file to upload (jpg, png, etc.) |
| `caption` | Text | Yes      | A text description for the post           |

**How to test with cURL:**

```bash
curl -X POST http://localhost:3000/create-post \
  -F "image=@/path/to/your/photo.jpg" \
  -F "caption=My first post!"
```

**How to test with Postman:**

1. Set method to `POST` and URL to `http://localhost:3000/create-post`
2. Go to `Body` tab → select `form-data`
3. Add key `image` → change type dropdown to `File` → select an image file
4. Add key `caption` → type `Text` → enter your caption text
5. Click `Send`

**✅ Success Response (Status 201 — Created):**

```json
{
    "message": "Post created successfully",
    "post": {
        "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
        "image": "https://ik.imagekit.io/your_id/image.jpg",
        "caption": "My first post!",
        "__v": 0
    }
}
```

| Response Field | Type   | Description                                                       |
| -------------- | ------ | ----------------------------------------------------------------- |
| `message`      | String | A human-readable success message.                                 |
| `post`         | Object | The newly created post document from MongoDB.                     |
| `post._id`     | String | The unique ID MongoDB assigned to this post (auto-generated).     |
| `post.image`   | String | The public URL of the uploaded image on ImageKit's CDN.           |
| `post.caption` | String | The caption text you sent in the request.                         |
| `post.__v`     | Number | Mongoose version key (tracks document revisions, auto-generated). |

**❌ Error Response (Status 500 — Internal Server Error):**

```json
{
    "message": "Error creating post",
    "error": "Cannot read properties of undefined (reading 'buffer')"
}
```

This happens when:

- No image file was attached to the request
- The `image` field name doesn't match what's expected
- ImageKit API key is invalid
- Database connection failed

---

### GET /post

**Purpose:** Fetch all posts from the database.

**HTTP Method:** `GET`

**URL:** `http://localhost:3000/post`

**Request Fields:** None — just send the request.

**How to test with cURL:**

```bash
curl http://localhost:3000/post
```

**How to test in a browser:**

Just open `http://localhost:3000/post` in your browser — you'll see the JSON response directly.

**✅ Success Response (Status 200 — OK):**

```json
{
    "message": "Posts fetched successfully",
    "posts": [
        {
            "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
            "image": "https://ik.imagekit.io/your_id/image.jpg",
            "caption": "My first post!",
            "__v": 0
        },
        {
            "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
            "image": "https://ik.imagekit.io/your_id/image.jpg",
            "caption": "Another post!",
            "__v": 0
        }
    ]
}
```

| Response Field    | Type   | Description                                                                                 |
| ----------------- | ------ | ------------------------------------------------------------------------------------------- |
| `message`         | String | A human-readable success message.                                                           |
| `posts`           | Array  | An array containing all post objects from the database. Empty array `[]` if no posts exist. |
| `posts[].image`   | String | The public URL of the image on ImageKit.                                                    |
| `posts[].caption` | String | The text caption.                                                                           |

**❌ Error Response (Status 500):**

```json
{
    "message": "Error fetching posts",
    "error": "connection timed out"
}
```

---

## Project Structure

```
the-backend/
│
├── backend/                            ← All backend code lives here
│   ├── server.js                       ← 🚀 ENTRY POINT — starts the server
│   ├── package.json                    ← 📦 Project config and dependency list
│   ├── package-lock.json               ← 🔒 Locks exact dependency versions
│   ├── .env                            ← 🔑 Secret environment variables (NOT committed)
│   ├── .env.example                    ← 📋 Template showing required env vars (safe to commit)
│   │
│   └── src/                            ← 📁 ALL source code
│       ├── app.js                      ← 🧠 Express app setup + middleware + route mounting
│       │
│       ├── config/                     ← ⚙️ Configuration files
│       │   └── db.js                   ← Database connection setup
│       │
│       ├── routes/                     ← 🛤️ URL → function mapping
│       │   └── post.routes.js          ← Defines /create-post and /post endpoints
│       │
│       ├── controllers/                ← 🎮 Business logic (what happens when URL is hit)
│       │   └── post.controller.js      ← createPost() and getPosts() functions
│       │
│       ├── middlewares/                ← 🔧 Request preprocessors
│       │   └── upload.middleware.js    ← Multer file upload config
│       │
│       ├── models/                     ← 📐 Data structure definitions
│       │   └── post.model.js           ← Post schema (image + caption)
│       │
│       └── services/                   ← 🌐 External API integrations
│           └── storage.service.js      ← ImageKit upload function
│
├── postman/                            ← Postman API test collections
├── .gitignore                          ← Files/folders Git should ignore
├── LICENSE                             ← Project license
└── README.md                           ← This file
```

---

## Folder Explanations

### Why `backend/`?

This is the container for all backend server code. In a larger project, you might also have a `frontend/` folder for the client-side app.

### Why `src/`?

Short for "source." It separates YOUR code from config files (`package.json`, `.env`, `.gitignore`). Everything you write goes here. Config files stay at the root level.

### Why `config/`?

**Config = Configuration.** Files that configure HOW your app connects to external things (databases, APIs). If someone asks "how does the app connect to MongoDB?", you look here. Not business logic, just setup.

### Why `routes/`?

**Routes = URL mappings.** A route says "when someone visits THIS URL with THIS method, run THIS function." It's like a phone directory — it maps numbers (URLs) to people (functions). You can see every endpoint your API has by looking in this folder.

### Why `controllers/`?

**Controllers = the actual logic.** When a route matches a URL, it calls a controller function. The controller does the real work: talking to the database, processing data, sending responses. Separated from routes so routes stay clean and short.

### Why `middlewares/`?

**Middleware = processing that happens BEFORE the controller.** Think of airport security: before you board (reach the controller), you pass through security (middleware). Example: Multer middleware reads the uploaded file from the request before the controller gets it.

### Why `models/`?

**Models = data blueprints.** A model defines what your data LOOKS LIKE in the database. "A Post has an image (string) and a caption (string)." Each file = one MongoDB collection. When you need to know what data is stored, look here.

### Why `services/`?

**Services = external API wrappers.** A service talks to an external system (ImageKit, email, payment). If you ever switch from ImageKit to AWS S3, you only change the service file — nothing else in your app changes. This is separation of concerns.

---

## Code Walkthrough — File by File

Every line of every file, explained.

---

### 1. `package.json` — Project Configuration

This file is the "ID card" of your Node.js project. It defines metadata, scripts, and dependencies. It's created when you run `npm init`.

```json
{
    "name": "the-backend",
```

- `"name"` — The project's name. Used when publishing to npm (not relevant here).

```json
    "version": "1.0.0",
```

- `"version"` — Current version of the project. Follows semantic versioning (major.minor.patch).

```json
    "description": "npm init -y => \r npm install nodemon\r npm install express",
```

- `"description"` — A text description of the project (this currently has setup notes, could be more descriptive).

```json
    "main": "server.js",
```

- `"main"` — The entry point file. When someone imports your package or Node.js starts, it runs this file.

```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node server.js",
        "dev": "nodemon server.js"
    },
```

- `"scripts"` — Custom commands you can run with `npm run <name>`:
    - `"test"` — Placeholder. Currently just prints an error (no tests written yet).
    - `"start"` — Runs `node server.js`. Used in production. `node` runs the file once.
    - `"dev"` — Runs `nodemon server.js`. Nodemon watches for file changes and auto-restarts the server. Used during development.

```json
    "type": "commonjs",
```

- `"type"` — Module system. `"commonjs"` means we use `require()` and `module.exports` (the older Node.js way). The alternative is `"module"` which uses `import`/`export`.

```json
    "devDependencies": {
        "nodemon": "^3.1.11"
    },
```

- `"devDependencies"` — Packages needed only during development, not in production.
    - `nodemon` — Auto-restarts the server when files change. The `^` means "compatible with version 3.1.11".

```json
    "dependencies": {
        "@imagekit/nodejs": "^7.3.0",
        "dotenv": "^17.2.4",
        "express": "^5.2.1",
        "mongoose": "^9.2.0",
        "multer": "^2.0.2"
    }
```

- `"dependencies"` — Packages needed to run the app:
    - `@imagekit/nodejs` — Official ImageKit SDK for uploading images.
    - `dotenv` — Reads `.env` files and loads variables into `process.env`.
    - `express` — Web framework for handling HTTP requests and responses.
    - `mongoose` — ODM for MongoDB. Provides schemas, validation, and query API.
    - `multer` — Middleware for processing file uploads from forms.

---

### 2. `.env` — Environment Variables

Environment variables are settings that change between environments (development, staging, production). They're stored outside the code so secrets aren't committed to Git.

```env
PORT=3000
```

- `PORT` — Which port the server listens on. `3000` means `http://localhost:3000`. In production, this might be `80` or `443`.

```env
MONGODB_URI=your_mongodb_connection_string
```

- `MONGODB_URI` — The full connection string to your MongoDB database. Includes the username, password, host, and database name.

```env
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

- `IMAGEKIT_PRIVATE_KEY` — Your secret API key for ImageKit. Used to authenticate when uploading images. **Never share this publicly.**

---

### 3. `server.js` — Entry Point

This is the first file that runs. It starts the server and connects to the database.

```javascript
const app = require("./src/app");
```

- **`require("./src/app")`** — Imports the configured Express application from `src/app.js`.
- **`require()`** — The CommonJS way to import a module (file). It finds the file, runs it, and returns whatever that file `module.exports`.
- **`"./src/app"`** — Relative path. `./` means "current directory." We don't need `.js` extension because Node.js adds it automatically.

```javascript
const connectDB = require("./src/config/db");
```

- Imports the `connectDB` function from `src/config/db.js`. This function connects to MongoDB.

```javascript
const PORT = process.env.PORT || 3001;
```

- **`process.env.PORT`** — Reads the `PORT` variable from the `.env` file (loaded by dotenv in app.js).
- **`||`** — The OR operator. If `process.env.PORT` is `undefined` (not set), use `3001` as a fallback.
- **`const`** — Declares a constant variable (can't be reassigned).

```javascript
connectDB();
```

- Calls the database connection function. This runs the `mongoose.connect()` call inside `db.js`. We do this before starting the server so the database is ready before any requests come in.

```javascript
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

- **`app.listen(PORT, callback)`** — Tells Express to start accepting HTTP requests on the given port.
- **`() => { ... }`** — An arrow function (callback). This runs AFTER the server successfully starts.
- **`` `Server is running on http://localhost:${PORT}` ``** — A template literal (backtick string). `${PORT}` inserts the value of the `PORT` variable.
- **`console.log()`** — Prints a message to the terminal so you know the server is running.

---

### 4. `src/app.js` — Express Application Setup

Creates the Express app, adds middleware, and mounts routes.

```javascript
const express = require("express");
```

- Imports the Express library. `express` is a function that creates an application when called.

```javascript
require("dotenv").config();
```

- **`require("dotenv")`** — Imports the dotenv library.
- **`.config()`** — Immediately calls its `config()` method. This reads the `.env` file in the project root and loads all variables into `process.env`.
- **Why here?** This must run before any code tries to read `process.env.MONGODB_URI` or any other env variable. Since `app.js` is imported by `server.js` early, this is a good place.

```javascript
const postRoutes = require("./routes/post.routes");
```

- Imports the post routes. This is an Express Router object that contains all the route definitions for posts.

```javascript
const app = express();
```

- **`express()`** — Creates a new Express application instance. This `app` object has methods like `.use()`, `.get()`, `.post()`, `.listen()`.

```javascript
app.use(express.json());
```

- **`app.use()`** — Registers a middleware that runs on EVERY request.
- **`express.json()`** — Built-in Express middleware that parses incoming request bodies containing JSON. Without this, `req.body` would be `undefined` when a client sends JSON data.
- **Example:** If a client sends `{"caption": "Hello"}`, this middleware parses it and puts it into `req.body.caption`.

```javascript
app.use("/", postRoutes);
```

- **`app.use("/", postRoutes)`** — Mounts the post router at the root path `/`.
- This means all routes defined in `post.routes.js` are accessible directly. For example, if `post.routes.js` defines `router.post("/create-post")`, it becomes `POST /create-post` (not `POST //create-post`).
- If we wrote `app.use("/api", postRoutes)`, then it would be `POST /api/create-post`.

```javascript
module.exports = app;
```

- **`module.exports`** — Makes the `app` available to other files. When `server.js` does `require("./src/app")`, it gets this `app` object.

---

### 5. `src/config/db.js` — Database Connection

Connects to MongoDB using Mongoose.

```javascript
const mongoose = require("mongoose");
```

- Imports the Mongoose library. Mongoose is an ODM — it provides schemas, models, and a clean API for interacting with MongoDB.

```javascript
async function connectDB() {
```

- **`async function`** — Declares an asynchronous function. The `async` keyword means this function can use `await` inside it.
- **Why async?** Connecting to a database takes time (it's a network operation). `async/await` lets us wait for it to finish without blocking the entire program.

```javascript
    try {
```

- **`try { ... } catch { ... }`** — Error handling. Code inside `try` runs normally. If any line throws an error, execution jumps to `catch`.

```javascript
await mongoose.connect(process.env.MONGODB_URI);
```

- **`mongoose.connect(uri)`** — Connects to the MongoDB database at the given URI (connection string).
- **`await`** — Pauses this function until the connection is established (or fails). Without `await`, the code would continue immediately without waiting.
- **`process.env.MONGODB_URI`** — Reads the connection string from the environment variable (set in `.env`).

```javascript
console.log("Database Connected");
```

- Prints a success message to the terminal.

```javascript
    } catch (error) {
        console.log(error);
    }
```

- **`catch (error)`** — If `mongoose.connect()` fails (wrong password, network issue, etc.), the error object is caught here and printed.

```javascript
module.exports = connectDB;
```

- Exports the function so `server.js` can call it.

---

### 6. `src/models/post.model.js` — Data Schema

Defines what a "Post" looks like in the database.

```javascript
const mongoose = require("mongoose");
```

- Imports Mongoose to use its Schema and model features.

```javascript
const postSchema = new mongoose.Schema({
    image: String,
    caption: String,
});
```

- **`new mongoose.Schema({ ... })`** — Creates a new schema (data structure definition).
- **`image: String`** — The `image` field stores a String value (the URL of the uploaded image).
- **`caption: String`** — The `caption` field stores a String value (the text description).
- **What this means:** Every post document in MongoDB will have these two fields. Mongoose will also auto-add `_id` (unique identifier) and `__v` (version number).
- **You could add more options:**
    ```javascript
    image: { type: String, required: true }  // Makes the field mandatory
    ```

```javascript
const postModel = mongoose.model("Post", postSchema);
```

- **`mongoose.model("Post", postSchema)`** — Creates a model from the schema.
- **`"Post"`** — The model name. Mongoose automatically creates/connects to a MongoDB collection called `"posts"` (lowercase, pluralized).
- **The model gives you methods like:**
    - `postModel.create({...})` — Create a new document
    - `postModel.find()` — Find all documents
    - `postModel.findById(id)` — Find one by ID
    - `postModel.findByIdAndUpdate(id, {...})` — Update one
    - `postModel.findByIdAndDelete(id)` — Delete one

```javascript
module.exports = postModel;
```

- Exports the model so controllers can use it for database operations.

---

### 7. `src/services/storage.service.js` — ImageKit Upload

Handles uploading images to ImageKit's cloud storage.

```javascript
const { ImageKit } = require("@imagekit/nodejs");
```

- **`const { ImageKit }`** — Destructuring import. The `@imagekit/nodejs` package exports an object, and we're extracting the `ImageKit` class from it.
- **Destructuring:** `const { ImageKit } = require(...)` is the same as:
    ```javascript
    const pkg = require("@imagekit/nodejs");
    const ImageKit = pkg.ImageKit;
    ```

```javascript
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
```

- **`new ImageKit({ ... })`** — Creates a new ImageKit client instance.
- **`privateKey`** — Your secret API key, read from `.env`. This authenticates all requests to ImageKit.

```javascript
async function uploadFile(buffer) {
```

- **`buffer`** — A parameter containing the raw binary data of the uploaded file. This comes from multer's memory storage (`req.file.buffer`).
- **What is a Buffer?** A Buffer is Node.js's way of handling raw binary data (like an image's bytes: `<Buffer ff d8 ff e0 ...>`).

```javascript
const result = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.jpg",
});
```

- **`client.files.upload({ ... })`** — Calls ImageKit's upload API.
- **`buffer.toString("base64")`** — Converts the binary Buffer to a base64 string. Base64 is a text encoding for binary data. ImageKit requires files to be sent as base64 strings.
    - Binary: `<Buffer ff d8 ff e0 ...>` → Base64: `"/9j/4AAQ..."` (a long text string)
- **`fileName: "image.jpg"`** — The name for the file on ImageKit's servers. All uploads get this default name (ImageKit appends unique suffixes automatically).
- **`await`** — Waits for the upload to complete before continuing. The upload is a network request, so it takes time.
- **`result`** — The response from ImageKit. Contains:
    - `result.url` — The public CDN URL of the image (e.g., `https://ik.imagekit.io/your_id/image.jpg`)
    - `result.fileId` — Unique file identifier
    - `result.name` — Filename on ImageKit

```javascript
return result;
```

- Returns the ImageKit response to the caller (the controller).

```javascript
module.exports = uploadFile;
```

- Exports the function so controllers can use it.

---

### 8. `src/middlewares/upload.middleware.js` — File Upload Handler

Configures Multer to read file uploads from incoming requests.

```javascript
const multer = require("multer");
```

- Imports the Multer library.

```javascript
const upload = multer({ storage: multer.memoryStorage() });
```

- **`multer({ storage: ... })`** — Creates a configured Multer instance.
- **`multer.memoryStorage()`** — Tells Multer to store uploaded files in RAM (memory) as Buffer objects, NOT on disk.
    - **Memory storage:** File data is in `req.file.buffer` (a Buffer).
    - **Disk storage (alternative):** File would be saved to a folder on your server.
    - **Why memory?** Because we immediately upload the file to ImageKit. We don't need a local copy on disk.

```javascript
module.exports = upload;
```

- Exports the configured multer instance.
- **How it's used in routes:**
    ```javascript
    // upload.single("image") — means:
    // "Read ONE file from the form field named 'image'"
    // After running, the file is available at req.file
    router.post("/create-post", upload.single("image"), createPost);
    ```
- **Other multer methods:**
    - `upload.single("fieldname")` — One file
    - `upload.array("fieldname", maxCount)` — Multiple files, same field
    - `upload.none()` — No files, just text fields

---

### 9. `src/routes/post.routes.js` — Route Definitions

Maps URLs to controller functions.

```javascript
const express = require("express");
```

- Imports Express to use its Router feature.

```javascript
const router = express.Router();
```

- **`express.Router()`** — Creates a new Router object. Think of it as a "mini Express app" that only handles routing. You define routes on it, then mount it in `app.js`.

```javascript
const upload = require("../middlewares/upload.middleware");
```

- **`"../middlewares/upload.middleware"`** — `../` means "go up one directory" (from `routes/` back to `src/`), then into `middlewares/`.
- Imports the configured Multer instance.

```javascript
const { createPost, getPosts } = require("../controllers/post.controller");
```

- **Destructuring import.** The controller exports `{ createPost, getPosts }`, so we extract both functions.

```javascript
router.post("/create-post", upload.single("image"), createPost);
```

- **`router.post("/create-post", ...)`** — When someone sends a `POST` request to `/create-post`:
    1. **First runs:** `upload.single("image")` — the upload middleware reads the file from the `"image"` form field and puts it in `req.file`.
    2. **Then runs:** `createPost` — the controller function that uploads to ImageKit and saves to MongoDB.
- **Why two functions?** Express supports chaining middleware. Each function runs in order. The middleware processes the file, then the controller uses it.

```javascript
router.get("/post", getPosts);
```

- **`router.get("/post", getPosts)`** — When someone sends a `GET` request to `/post`, run the `getPosts` controller (no middleware needed since there's no file upload).

```javascript
module.exports = router;
```

- Exports the router. In `app.js`, `app.use("/", router)` mounts it.

---

### 10. `src/controllers/post.controller.js` — Request Handlers

The actual business logic that runs when API endpoints are hit.

```javascript
const postModel = require("../models/post.model");
```

- Imports the Post Mongoose model to interact with the `posts` collection in MongoDB.

```javascript
const uploadFile = require("../services/storage.service");
```

- Imports the ImageKit upload function from the storage service.

```javascript
const createPost = async (req, res) => {
```

- **`async`** — This function uses `await` inside it (for database and API calls).
- **`(req, res)`** — Every Express handler receives two objects:
    - **`req` (Request)** — Contains all information about the incoming request:
        - `req.body` — Parsed JSON or form text fields (e.g., `req.body.caption`)
        - `req.file` — The uploaded file (set by Multer middleware)
        - `req.params` — URL parameters (e.g., `/post/:id` → `req.params.id`)
        - `req.query` — Query string (e.g., `/post?page=2` → `req.query.page`)
    - **`res` (Response)** — Used to send a response back to the client:
        - `res.status(201)` — Sets the HTTP status code
        - `res.json({...})` — Sends a JSON response
- **`=>`** — Arrow function syntax. `const fn = (a, b) => { ... }` is similar to `function fn(a, b) { ... }`.

```javascript
    try {
        const result = await uploadFile(req.file.buffer);
```

- **`req.file.buffer`** — The raw binary data of the uploaded image (set by Multer's memory storage middleware).
- **`await uploadFile(buffer)`** — Calls the storage service to upload the image to ImageKit. Waits for the upload to complete and catches the URL in `result`.

```javascript
const post = await postModel.create({
    image: result.url,
    caption: req.body.caption,
});
```

- **`postModel.create({...})`** — Creates a new document in the MongoDB `posts` collection.
- **`result.url`** — The public ImageKit URL of the uploaded image (e.g., `https://ik.imagekit.io/.../image.jpg`).
- **`req.body.caption`** — The caption text sent by the client in the request body.
- **`await`** — Waits for MongoDB to save the document and return the saved post (including the auto-generated `_id`).

```javascript
res.status(201).json({ message: "Post created successfully", post });
```

- **`res.status(201)`** — Sets HTTP status to `201 Created` (means "a new resource was successfully created").
- **`.json({...})`** — Sends a JSON response to the client.
- **`{ message: "...", post }`** — The response body. `post` is shorthand for `post: post` (ES6 shorthand property).

```javascript
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
```

- **`catch (error)`** — If ANY line inside `try` throws an error, execution jumps here.
- **`res.status(500)`** — HTTP `500 Internal Server Error` — something went wrong on the server.
- **`error.message`** — A human-readable error description (e.g., `"Cannot read properties of undefined"`).

```javascript
const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find();
```

- **`postModel.find()`** — Finds ALL documents in the `posts` collection. Returns an array.
- **With no arguments**, `.find()` returns everything. You can filter: `.find({ caption: "hello" })`.

```javascript
res.status(200).json({ message: "Posts fetched successfully", posts });
```

- **`res.status(200)`** — HTTP `200 OK` — the request was successful.
- **`posts`** — The array of all posts from the database.

```javascript
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};
```

- Same error handling pattern — catches database errors, network timeouts, etc.

```javascript
module.exports = { createPost, getPosts };
```

- **Exports both functions as an object.** The route file imports them with destructuring: `const { createPost, getPosts } = require(...)`.

---

## How a Request Flows Through the App

Here's the complete journey of a `POST /create-post` request:

```
Client (Postman/Browser/curl)
    │
    │  Sends: POST /create-post
    │  Body: image file + caption text
    │
    ▼
┌──────────────────────────────────┐
│  server.js                       │
│  App is listening on PORT 3000   │
│  Receives the HTTP request       │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/app.js                      │
│  1. express.json() → parses JSON │
│  2. Matches URL "/" → postRoutes │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/routes/post.routes.js       │
│  Matches POST "/create-post"     │
│  → Runs upload.single("image")  │
│  → Then runs createPost          │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/middlewares/upload.middleware│
│  Multer reads the image file     │
│  Stores it in memory (Buffer)    │
│  Sets req.file = { buffer, ... } │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/controllers/post.controller │
│  1. Gets req.file.buffer         │
│  2. Calls uploadFile(buffer)    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/services/storage.service    │
│  Converts buffer to base64      │
│  Uploads to ImageKit API         │
│  Returns { url, fileId, ... }    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/controllers/post.controller │
│  3. Gets result.url              │
│  4. Calls postModel.create()    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/models/post.model           │
│  Mongoose validates the data     │
│  Saves to MongoDB "posts"        │
│  Returns the saved document      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  src/controllers/post.controller │
│  5. Sends response:              │
│     Status: 201 Created          │
│     { message, post }            │
└──────────────┬───────────────────┘
               │
               ▼
Client receives JSON response ✅
```

---

## Key Concepts for Beginners

### What is an API?

API (Application Programming Interface) is a way for two programs to communicate. Our backend is an API — it receives requests (like "create a post") and sends responses (like "here's the created post").

### What is REST?

REST (Representational State Transfer) is a set of rules for designing APIs:

- Use URLs to represent resources (`/post` = posts)
- Use HTTP methods for actions (`GET` = read, `POST` = create, `PUT` = update, `DELETE` = delete)
- Send/receive data as JSON

### What is HTTP?

HTTP (HyperText Transfer Protocol) is how browsers and servers communicate. Every request has:

- A **method** (GET, POST, PUT, DELETE)
- A **URL** (where to send it)
- **Headers** (metadata)
- A **body** (data, optional)

### What are HTTP Status Codes?

Numbers that tell the client what happened:
| Code | Meaning |
| ---- | ------- |
| `200` | OK — request succeeded |
| `201` | Created — new resource was created |
| `400` | Bad Request — client sent invalid data |
| `404` | Not Found — URL doesn't exist |
| `500` | Internal Server Error — something broke on the server |

### What is `async/await`?

JavaScript runs one line at a time. Some operations (database queries, API calls) take time. `async/await` lets you "pause" and wait for them to finish without freezing the whole program.

```javascript
// Without async/await (callback / promise hell):
uploadFile(buffer).then(result => {
    postModel.create({...}).then(post => {
        res.json(post);
    });
});

// With async/await (clean and readable):
const result = await uploadFile(buffer);
const post = await postModel.create({...});
res.json(post);
```

### What is `module.exports` / `require()`?

Node.js's system for sharing code between files:

- `module.exports = something` — Makes `something` available to other files.
- `const something = require("./file")` — Imports what `file.js` exported.

---

## How to Add a New Feature

**Example:** Adding a Users resource.

### Step 1: Create the model

Create `src/models/user.model.js`:

```javascript
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});
module.exports = mongoose.model("User", userSchema);
```

### Step 2: Create the controller

Create `src/controllers/user.controller.js`:

```javascript
const User = require("../models/user.model");

const createUser = async (req, res) => {
    /* ... */
};
const getUsers = async (req, res) => {
    /* ... */
};

module.exports = { createUser, getUsers };
```

### Step 3: Create the route

Create `src/routes/user.routes.js`:

```javascript
const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user.controller");

router.post("/users", createUser);
router.get("/users", getUsers);

module.exports = router;
```

### Step 4: Mount in app.js

```javascript
const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);
```

---

## License

[ISC](LICENSE)
