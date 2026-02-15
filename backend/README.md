# ️ Backend — Express.js API Server (Detailed Documentation)

This document explains **every single file, every line of code, every import, and every concept** in the backend. If you're an absolute beginner, read through this from top to bottom.

---

## Backend Folder Structure

```
backend/
├── server.js                     ← ENTRY POINT — the first file that runs
├── package.json                  ← Project metadata + dependencies list + npm scripts
├── .env                          ← Secret environment variables (NOT committed to Git)
├── .env.example                  ← Template showing what .env needs
│
└── src/                          ← All source code organized by responsibility
    ├── app.js                    ← Express app setup — middleware, routes, error handling
    │
    ├── config/                   ← Configuration and settings
    │   ├── constants.js          ← All hardcoded values in one place
    │   └── db.js                 ← MongoDB connection logic
    │
    ├── controllers/              ← Business logic — what happens when API is called
    │   └── post.controller.js    ← Create post + get posts logic
    │
    ├── middlewares/               ← Functions that run between request and response
    │   ├── error.middleware.js   ← Global error handler catches all errors
    │   └── upload.middleware.js  ← File upload configuration (Multer)
    │
    ├── models/                   ← Database structure definitions
    │   └── post.model.js         ← Post schema — what a Post looks like in the DB
    │
    ├── routes/                   ← URL-to-function mappings
    │   └── post.routes.js        ← Which URL triggers which controller
    │
    └── services/                 ← Third-party service integrations
        └── storage.service.js    ← ImageKit upload logic
```

---

## package.json — The Project's Identity Card

The `package.json` file is like your project's ID card. It tells Node.js and npm everything about your project.

```json
{
    "name": "the-backend",
    "version": "1.0.0",
    "main": "server.js",
    "type": "commonjs",
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
    },
    "dependencies": {
        "@imagekit/nodejs": "...",
        "cors": "...",
        "dotenv": "...",
        "express": "...",
        "mongoose": "...",
        "multer": "..."
    },
    "devDependencies": {
        "nodemon": "..."
    }
}
```

**Line-by-line:**

| Field                | What It Means                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"name"`             | The project name. Used by npm to identify the package.                                                                                            |
| `"version"`          | Current version number following semantic versioning (major.minor.patch).                                                                         |
| `"main"`             | The entry file. When you `require()` this package, Node starts here.                                                                              |
| `"type": "commonjs"` | Use `require()` / `module.exports` syntax (traditional Node.js style). The alternative is `"module"` which uses `import` / `export` (ES Modules). |
| `"scripts"`          | Custom commands you run with `npm run <name>`.                                                                                                    |
| `"start"`            | `npm start` → Runs `node server.js` (starts the server).                                                                                          |
| `"dev"`              | `npm run dev` → Runs `nodemon server.js` (starts with auto-restart on file changes).                                                              |
| `"dependencies"`     | Packages needed for the app to RUN (installed in production + development).                                                                       |
| `"devDependencies"`  | Packages only needed during DEVELOPMENT (like nodemon — auto-restarter).                                                                          |

**What is `npm install`?** It reads `package.json`, downloads all listed packages from the npm registry (npmjs.com), and puts them in the `node_modules/` folder.

**What is `node_modules/`?** The folder where all downloaded packages live. It's often huge (hundreds of folders). Never edit files inside it. Never commit it to Git (that's why `.gitignore` excludes it).

---

## ️ .env and .env.example — Environment Variables

### What are Environment Variables?

Environment variables are values that are different in different environments (your laptop vs a production server). They store secrets (passwords, API keys) that should NEVER be in your code or on GitHub.

### .env.example (safe to share — it's a template):

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
```

### .env (YOUR actual secrets — never commit this!):

```env
PORT=3000
MONGODB_URI=mongodb+srv://aditya:mysecretpassword@cluster0.abc123.mongodb.net/the-backend
IMAGEKIT_PRIVATE_KEY=private_abc123xyz456
```

### How does code read these values?

The `dotenv` package reads the `.env` file and puts each value into `process.env`:

- `process.env.PORT` → `"3000"`
- `process.env.MONGODB_URI` → `"mongodb+srv://..."`
- `process.env.IMAGEKIT_PRIVATE_KEY` → `"private_abc123..."`

---

## File-by-File Code Walkthrough

---

### 1. `server.js` — Entry Point (The Front Door)

This is the **first file that runs** when you start the app. Its only jobs are:

1. Connect to the database
2. Start the HTTP server
3. Handle shutdown gracefully

```js
const app = require("./src/app");
```

- **What:** Imports the configured Express app from `src/app.js`.
- **`require()`** is how CommonJS loads other files/modules. It reads the file, runs it, and returns whatever that file exported with `module.exports`.
- **Why separate?** `server.js` handles STARTING the server. `app.js` handles CONFIGURING the server. Separating them keeps each file focused on one job.

```js
const { connectDB, mongoose } = require("./src/config/db");
```

- **What:** Imports two things from `db.js`:
    - `connectDB` — a function that connects to MongoDB
    - `mongoose` — the Mongoose library instance (used later to close the DB connection)
- **`{ connectDB, mongoose }`** is called "destructuring" — it pulls specific properties out of an object. `db.js` exports `{ connectDB, mongoose }` and we're grabbing both.

```js
const { DEFAULT_PORT } = require("./src/config/constants");
```

- **What:** Imports the default port number (3000) from our constants file.
- **Why from constants?** So if we ever want to change the default port, we only change it in ONE place.

```js
const PORT = process.env.PORT || DEFAULT_PORT;
```

- **What:** Sets the port number.
- **`process.env.PORT`** — Reads the PORT value from environment variables (the `.env` file).
- **`||`** — The OR operator. If `process.env.PORT` is undefined (not set), use `DEFAULT_PORT` (3000) instead.
- **Why?** In production (like Heroku), the hosting platform sets PORT for you. During development, you might not set it, so we fall back to 3000.

```js
async function startServer() {
```

- **What:** Declares an async function.
- **`async`** — Means this function can use `await` (wait for Promises to resolve). Database connections and server startup are async operations (they take time).

```js
await connectDB();
```

- **What:** Calls the `connectDB()` function and WAITS for it to finish.
- **`await`** — Pauses execution until the Promise resolves. We need the database connected BEFORE starting the server.
- **Why?** If the database isn't connected and someone makes a request, it would crash. So we connect first.

```js
    const server = app.listen(PORT, () => {
        console.log(`\n Server is running on http://localhost:${PORT}`);
        ...
    });
```

- **`.listen(PORT, callback)`** — Tells Express to start accepting HTTP requests on the given port.
- **The callback function** runs ONCE when the server is successfully started.
- **Template literals** — The backtick strings with `${PORT}` insert variable values into the string. `${PORT}` becomes `3000`.
- **`server`** — We save the returned server object so we can close it later during shutdown.

```js
    const gracefulShutdown = (signal) => { ... };
```

- **What:** A function that cleanly stops the server.
- **"Graceful shutdown"** means: stop accepting new requests, finish any in-progress requests, close the database connection, then exit. This prevents data corruption.

```js
    server.close(async () => { ... });
```

- **`server.close()`** — Stops the server from accepting new connections. Existing connections are allowed to finish.

```js
await mongoose.connection.close();
```

- **What:** Closes the MongoDB connection cleanly.
- **Why?** If you just kill the process (`process.exit()`), the database connection might not close properly, which can leave "zombie" connections on MongoDB.

```js
setTimeout(() => {
    console.error(" Shutdown timed out. Forcing exit...");
    process.exit(1);
}, 10000);
```

- **What:** If shutdown takes more than 10 seconds, force-exit the process.
- **Why?** Sometimes `server.close()` hangs (e.g., a request is stuck). This timeout prevents the server from hanging forever.
- **`process.exit(1)`** — Exits the Node.js process. `1` means "exited with an error." `0` would mean "exited successfully."

```js
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
```

- **`process.on("signal", callback)`** — Listen for operating system signals.
- **SIGTERM** — Sent by cloud platforms (AWS, Heroku) when they want your app to stop.
- **SIGINT** — Sent when you press Ctrl+C in the terminal.

```js
process.on("unhandledRejection", (reason) => { ... });
```

- **What:** Catches Promises that were rejected (errored) but nobody caught the error.
- **Example:** If you call `await someFunction()` without a try/catch and it fails, this handler catches it.
- **Why?** Without this, the error would be silently swallowed and you'd never know something broke.

```js
process.on("uncaughtException", (error) => { ... process.exit(1); });
```

- **What:** Catches synchronous errors that weren't caught by try/catch.
- **Why `process.exit(1)`?** After an uncaught exception, the app is in an unpredictable state. It's safest to exit and let a process manager (like PM2) restart it.

```js
startServer();
```

- **What:** Actually calls the function to start everything. Without this line, nothing would happen!

---

### 2. `src/app.js` — Express Application Setup (The Brain)

This file creates and configures the Express app — the "brain" that decides how to handle every request.

```js
const express = require("express");
```

- **What:** Imports the Express.js framework.
- **Express** is a function. When you call `express()`, it creates an "app" object that can handle HTTP requests.

```js
require("dotenv").config();
```

- **What:** Loads the `.env` file into `process.env`.
- **Why at the top?** This must run BEFORE any code that reads `process.env` values. Otherwise, the values won't be there yet.
- **Why `require("dotenv").config()` on one line?** It imports dotenv AND immediately calls `.config()` in a single line. Same as writing `const dotenv = require("dotenv"); dotenv.config();`.

```js
const cors = require("cors");
```

- **What:** Imports the CORS middleware.
- **Why?** By default, browsers block requests from one domain to another. Our frontend (localhost:5173) needs to call our backend (localhost:3000). CORS allows this.

```js
const postRoutes = require("./routes/post.routes");
```

- **What:** Imports the router that defines all post-related endpoints.

```js
const globalErrorHandler = require("./middlewares/error.middleware");
```

- **What:** Imports our custom error handling middleware.

```js
const { HTTP_STATUS } = require("./config/constants");
```

- **What:** Imports readable HTTP status codes (like `OK: 200`, `NOT_FOUND: 404`).

```js
const app = express();
```

- **What:** Creates a new Express application.
- **`app`** is now an object with methods like `.use()`, `.get()`, `.post()`, `.listen()`.

```js
app.use(cors());
```

- **`app.use()`** — Registers middleware that runs on EVERY request.
- **`cors()`** — The CORS middleware. With no arguments, it allows requests from ANY origin. In production, you'd restrict this to your frontend's domain.

```js
app.use(express.json());
```

- **What:** Parses JSON request bodies.
- **Why?** When the frontend sends JSON data (like `{"caption": "Hello"}`), Express needs to parse (convert) that JSON string into a JavaScript object. This middleware does that and puts the result in `req.body`.

```js
app.use(express.urlencoded({ extended: true }));
```

- **What:** Parses URL-encoded form data (like `caption=Hello&author=John`).
- **`extended: true`** — Allows nested objects in the form data (uses the `qs` library instead of the simpler `querystring` library).

```js
app.get("/health", (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Server is healthy and running ",
        timestamp: new Date().toISOString(),
    });
});
```

- **What:** A "health check" endpoint at GET `/health`.
- **Why?** Monitoring tools (like UptimeRobot or load balancers) hit this URL every few seconds to check if the server is alive. If it responds, the server is healthy. If it doesn't, something is wrong.
- **`req`** — The request object (contains info about the incoming HTTP request).
- **`res`** — The response object (used to send data back to the client).
- **`res.status(200)`** — Sets the HTTP status code to 200 (OK).
- **`.json({...})`** — Sends a JSON response.

```js
app.use("/api", postRoutes);
```

- **What:** Mounts the post router at the `/api` prefix.
- **What does "mount" mean?** All routes defined in `postRoutes` are now prefixed with `/api`. So a route defined as `/create-post` in the router becomes `/api/create-post`.
- **Why the `/api` prefix?** It's a convention that separates API routes from other routes (like serving HTML pages). It makes the URL structure clear: anything starting with `/api` is a data endpoint.

```js
app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});
```

- **What:** A 404 "catch-all" handler. If no route matched the request, this runs.
- **Why is it AFTER all routes?** Express middleware runs in ORDER. If a request doesn't match any previous route, it falls through to this one.
- **`req.method`** — The HTTP method (GET, POST, PUT, DELETE).
- **`req.originalUrl`** — The full URL path the user requested.

```js
app.use(globalErrorHandler);
```

- **What:** The global error handler. MUST be the last `app.use()`.
- **Why last?** When any route/middleware calls `next(error)`, Express skips all remaining normal middleware and jumps to the error handler. It must be registered last so it can catch errors from everything above it.

```js
module.exports = app;
```

- **What:** Exports the configured app so `server.js` can use it.
- **`module.exports`** — In CommonJS, this is how you expose code from a file to other files that `require()` it.

---

### 3. `src/config/constants.js` — Centralized Magic Values

"Magic values" are hardcoded numbers or strings in your code. Instead of scattering `5242880` across multiple files, we put it here with a clear name.

```js
const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

- **What:** Maximum upload file size = 5MB.
- **`5 * 1024 * 1024`** — Math: 5 × 1024 bytes/KB × 1024 KB/MB = 5,242,880 bytes = 5MB.
- **Why a calculation instead of `5242880`?** It's easier to read and understand. You can clearly see "5 megabytes."

```js
const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];
```

- **What:** The MIME types we accept for uploads.
- **MIME type** — A string that identifies the type of a file. When a browser uploads `photo.jpg`, it sends along `image/jpeg` as the MIME type.

```js
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
};
```

- **What:** HTTP status codes with readable names.
- **Why?** `res.status(HTTP_STATUS.BAD_REQUEST)` is clearer than `res.status(400)`. Anyone reading the code immediately knows what 400 means.

| Code | Name                  | When to Use                                             |
| ---- | --------------------- | ------------------------------------------------------- |
| 200  | OK                    | Request succeeded normally                              |
| 201  | Created               | A new resource was created (like a new post)            |
| 400  | Bad Request           | Client sent invalid data (missing fields, wrong format) |
| 404  | Not Found             | The requested URL/resource doesn't exist                |
| 500  | Internal Server Error | Something broke on the server (a bug)                   |

```js
const DEFAULT_PORT = 3000;
```

- **What:** The default port if `PORT` isn't set in `.env`.

```js
module.exports = {
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
    HTTP_STATUS,
    DEFAULT_PORT,
};
```

- **What:** Exports all constants as a single object so other files can import them.

---

### 4. `src/config/db.js` — MongoDB Connection

```js
const mongoose = require("mongoose");
```

- **What:** Imports Mongoose — the ODM (Object Data Modeling) library for MongoDB.
- **What is an ODM?** It's a layer between your JavaScript code and MongoDB. Instead of writing raw MongoDB queries, you use JavaScript objects and methods. Mongoose also provides schemas (data structure definitions) and validation.

```js
mongoose.connection.on("connected", () => { ... });
mongoose.connection.on("error", (err) => { ... });
mongoose.connection.on("disconnected", () => { ... });
```

- **What:** Event listeners for the database connection.
- **`.on("event", callback)`** — When this event occurs, run this function.
- **Why?** These log connection status so you can see what's happening with the database. Especially useful for debugging "why isn't my app working?" — you can see if the DB disconnected.

```js
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
```

- **`mongoose.connect(uri)`** — Connects to MongoDB using the connection string from `.env`.
- **`await`** — Waits for the connection to complete before continuing.
- **`try`** — Attempts to run this code. If an error occurs, it jumps to `catch`.

```js
    } catch (error) {
        console.error(" Database Connection Failed:", error.message);
        process.exit(1);
    }
```

- **`catch`** — Runs if `mongoose.connect()` fails (wrong URI, database is down, network issue, etc.).
- **`process.exit(1)`** — Exits the app immediately. The app CANNOT function without a database, so there's no point continuing.

```js
module.exports = { connectDB, mongoose };
```

- **What:** Exports both the connection function and the mongoose instance.
- **Why export `mongoose`?** It's needed in `server.js` to close the database connection during graceful shutdown (`mongoose.connection.close()`).

---

### 5. `src/controllers/post.controller.js` — Business Logic

Controllers contain the actual LOGIC that runs when someone calls an API endpoint. They:

1. Validate the incoming data
2. Do the work (upload image, save to database)
3. Send back a response

```js
const postModel = require("../models/post.model");
```

- **What:** The Mongoose model for Posts. Used to create and read posts from MongoDB.
- **`..`** — Means "go up one directory." From `controllers/`, `..` goes to `src/`, then into `models/`.

```js
const uploadFile = require("../services/storage.service");
```

- **What:** The function that uploads images to ImageKit.

```js
const { HTTP_STATUS } = require("../config/constants");
```

- **What:** HTTP status codes for readable responses.

```js
const createPost = async (req, res, next) => {
```

- **What:** The controller function for POST `/api/create-post`.
- **`req`** — The request object. Contains `req.file` (the uploaded image) and `req.body` (the form data like caption).
- **`res`** — The response object. Used to send data back to the client.
- **`next`** — A function that passes control to the next middleware. When called with an error `next(error)`, it jumps to the error handler.
- **Arrow function** `=>` — A shorter way to write functions. `(a, b) => { ... }` is similar to `function(a, b) { ... }`.

```js
    try {
        if (!req.file) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Image file is required. Please upload an image.",
            });
        }
```

- **`req.file`** — This is set by the Multer middleware. If the user didn't upload a file, `req.file` is `undefined`.
- **`!req.file`** — The `!` (NOT) operator. If `req.file` is undefined/null/false, this is `true`.
- **`return`** — Stops the function here. We don't want to continue if there's no image.
- **Why check on the server AND the client?** Client-side validation (in the frontend) can be bypassed (someone could use Postman or cURL). Server-side validation is the final safety net.

```js
        if (!req.body.caption || !req.body.caption.trim()) {
```

- **`req.body.caption`** — The caption text sent in the request body.
- **`.trim()`** — Removes whitespace from both ends of a string. `"  hello  ".trim()` → `"hello"`. If someone sends just spaces, `.trim()` returns `""` which is falsy.
- **`||`** — OR operator. If caption is undefined OR if trimmed caption is empty, reject.

```js
const result = await uploadFile(req.file.buffer);
```

- **`req.file.buffer`** — The raw binary data of the uploaded file (a Buffer).
- **Why buffer?** We're using Multer's memory storage, which keeps the file in RAM (not on disk). The Buffer is the file's raw bytes.
- **`result`** — The ImageKit response object, which contains `.url` (the public URL of the uploaded image).

```js
const post = await postModel.create({
    image: result.url,
    caption: req.body.caption.trim(),
});
```

- **`postModel.create({...})`** — Creates a new document (record) in the MongoDB "posts" collection.
- **`result.url`** — The CDN URL where ImageKit is hosting the uploaded image.
- **`await`** — Waits for MongoDB to save the document before continuing.

```js
res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Post created successfully",
    post,
});
```

- **`HTTP_STATUS.CREATED` (201)** — Correct status code for "a new resource was created."
- **`post`** — This is shorthand for `post: post`. In modern JavaScript, if the key name matches the variable name, you can just write it once.

```js
    } catch (error) {
        next(error);
    }
```

- **`next(error)`** — Passes the error to the global error handler middleware instead of crashing the server.
- **Why not handle the error here?** Centralizing error handling in one middleware means we don't repeat error-response logic in every controller.

```js
const getPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });
```

- **`.find()`** — Fetches ALL documents from the "posts" collection. No filter = get everything.
- **`.sort({ createdAt: -1 })`** — Sort by `createdAt` in descending order (-1 = newest first, 1 = oldest first).

```js
        count: posts.length,
```

- **`.length`** — The number of items in the array. Useful for the frontend to know how many posts exist.

---

### 6. `src/middlewares/upload.middleware.js` — File Upload Config

```js
const multer = require("multer");
```

- **Multer** — A middleware that handles `multipart/form-data` (the format used for file uploads). When a form has `<input type="file">`, the browser sends the data as multipart, and Multer reads it.

```js
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config/constants");
```

- **What:** Gets the file limits from our constants file (5MB max, images only).

```js
const fileFilter = (req, file, cb) => {
```

- **`fileFilter`** — A function Multer calls for each uploaded file to decide if it should be accepted or rejected.
- **`cb`** — "Callback." Multer expects you to call this to say "accept" or "reject."

```js
if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
} else {
    cb(new Error("Only image files are allowed!"), false);
}
```

- **`file.mimetype`** — The type of the uploaded file (e.g., `"image/jpeg"`).
- **`.includes()`** — Checks if the array contains the value. Returns `true` or `false`.
- **`cb(null, true)`** — First arg is error (null = no error), second is accept (true = yes).
- **`cb(new Error(...), false)`** — First arg is an error, second is reject (false = no).

```js
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});
```

- **`multer.memoryStorage()`** — Store the file in RAM (as a Buffer) instead of writing to disk. We don't need the file on disk because we're sending it directly to ImageKit.
- **`limits: { fileSize: MAX_FILE_SIZE }`** — Reject files larger than 5MB. If exceeded, Multer throws a `MulterError` with code `LIMIT_FILE_SIZE`.

---

### 7. `src/middlewares/error.middleware.js` — Global Error Handler

This is the "safety net" that catches ALL errors in the app and sends a proper JSON response instead of crashing.

```js
const globalErrorHandler = (err, req, res, next) => {
```

- **IMPORTANT:** Express identifies this as an error handler because it has **4 parameters** (err, req, res, next). Normal middleware has 3 (req, res, next). That extra `err` parameter is key.

```js
    if (err instanceof multer.MulterError) {
```

- **`instanceof`** — Checks if an error was created by a specific class. Multer throws `MulterError` objects for its own errors (file too large, too many files, etc.).

```js
    if (err.name === "ValidationError") {
```

- **What:** Catches Mongoose validation errors — when data doesn't match the schema (like a missing required field).

```js
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
```

- **What:** Only includes the error stack trace in development mode, not production.
- **`...`** — Spread operator. Spreads the object properties into the parent object.
- **`condition && value`** — Short-circuit. If condition is false, the whole expression is false (nothing spreads). If true, the value (the object with `stack`) gets spread in.
- **Why hide the stack in production?** Stack traces reveal internal file paths and code structure — information that could help hackers find vulnerabilities.

---

### 8. `src/models/post.model.js` — Database Schema

```js
const mongoose = require("mongoose");
```

```js
const postSchema = new mongoose.Schema(
    {
        image: { type: String, required: true, trim: true },
        caption: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    },
);
```

- **`new mongoose.Schema({...}, options)`** — Defines the STRUCTURE of a document.
- **`type: String`** — This field must be a string.
- **`required: true`** — This field must exist. If you try to save a post without it, Mongoose throws a `ValidationError`.
- **`trim: true`** — Automatically removes whitespace from the beginning and end. `"  hello  "` becomes `"hello"`.
- **`timestamps: true`** — Automatically adds and manages `createdAt` and `updatedAt` fields. You don't need to set them manually.

```js
const postModel = mongoose.model("Post", postSchema);
```

- **`mongoose.model("Post", postSchema)`** — Creates a Model from the schema.
- **The first argument `"Post"`** — The model name. Mongoose automatically creates a collection called `"posts"` (lowercase, pluralized) in MongoDB.
- **A Model** is like a class — you use it to create, read, update, and delete documents:
    - `postModel.create({...})` — Insert a new document
    - `postModel.find()` — Get all documents
    - `postModel.findById(id)` — Get one document by ID
    - `postModel.findByIdAndUpdate(id, {...})` — Update a document
    - `postModel.findByIdAndDelete(id)` — Delete a document

---

### 9. `src/routes/post.routes.js` — URL-to-Controller Mapping

```js
const express = require("express");
const router = express.Router();
```

- **`express.Router()`** — Creates a mini-app (router) that only handles routes. It's like a sub-section of the main app.
- **Why use Router?** It keeps routes organized. Instead of putting all routes in `app.js`, you put related routes in separate files and "mount" them.

```js
const upload = require("../middlewares/upload.middleware");
const { createPost, getPosts } = require("../controllers/post.controller");
```

```js
router.post("/create-post", upload.single("image"), createPost);
```

- **`router.post("/create-post", ...)`** — Handle POST requests to `/create-post` (full path: `/api/create-post` because this router is mounted at `/api`).
- **`upload.single("image")`** — A middleware that reads ONE file from the form field named `"image"`. It puts the file in `req.file`.
- **`createPost`** — The controller function that runs after Multer processes the file.
- **Multiple arguments** — Express lets you chain middlewares. The request flows through each one in order: Multer first, then the controller.

```js
router.get("/post", getPosts);
```

- **`router.get("/post", getPosts)`** — Handle GET requests to `/post` (full path: `/api/post`). No middleware needed — we're just reading data.

---

### 10. `src/services/storage.service.js` — ImageKit Upload

```js
const { ImageKit } = require("@imagekit/nodejs");
```

- **What:** Imports the ImageKit SDK (Software Development Kit) — a library that provides pre-built functions for interacting with ImageKit's API.

```js
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
```

- **`new ImageKit({...})`** — Creates an ImageKit client configured with your private API key.
- **Why `process.env`?** The private key is a secret. We keep it in `.env` and access it via `process.env`.

```js
async function uploadFile(buffer) {
```

- **`buffer`** — The raw binary data of the file (a Node.js Buffer object). This comes from `req.file.buffer` (Multer's memory storage).

```js
const uniqueFileName = `image_${Date.now()}.jpg`;
```

- **`Date.now()`** — Returns the current time as milliseconds since January 1, 1970 (Unix timestamp). Example: `1705312200000`.
- **Why unique names?** If two users upload files with the same name, one would overwrite the other. Timestamps ensure every filename is unique.

```js
const result = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: uniqueFileName,
});
```

- **`buffer.toString("base64")`** — Converts the binary data to a base64 string (a text representation of binary data). ImageKit's API requires files as base64 strings.
- **`result`** — The response from ImageKit. Contains `result.url` (the public CDN URL of the uploaded image).

```js
    } catch (error) {
        console.error(" ImageKit upload failed:", error.message);
        throw new Error(`Failed to upload image to storage: ${error.message}`);
    }
```

- **`throw new Error(...)`** — Creates a new error and throws it. This error propagates up to the controller, which passes it to `next(error)`, which sends it to the global error handler. The chain: service → controller → error middleware → response to user.

---

## Request Lifecycle — Full Path of a Request

When someone sends `POST /api/create-post` with an image and caption:

```
1. Request arrives at Express server (server.js → app.listen)
2. cors() middleware → checks if the origin is allowed → passes
3. express.json() → tries to parse JSON body → passes
4. express.urlencoded() → tries to parse form data → passes
5. Router matches /api/create-post (app.js → postRoutes)
6. upload.single("image") middleware runs:
   a. Reads the file from the multipart request
   b. Checks MIME type → if not image, throws Error
   c. Checks file size → if > 5MB, throws MulterError
   d. Stores file in memory (req.file.buffer)
7. createPost controller runs:
   a. Checks req.file exists → if not, returns 400
   b. Checks caption exists and is not empty → if not, returns 400
   c. Calls uploadFile(req.file.buffer) → sends to ImageKit → gets URL
   d. Calls postModel.create() → saves to MongoDB
   e. Returns 201 with post data
8. Response sent to the client!

IF ERROR at any step:
   → next(error) is called
   → globalErrorHandler catches it
   → Determines error type (Multer, Validation, Custom, Generic)
   → Sends appropriate error response (400 or 500)
```
