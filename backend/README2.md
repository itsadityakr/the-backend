# The Backend

A RESTful API built with **Express.js**, **MongoDB**, and **ImageKit** for creating and fetching posts with image uploads.

---

## Table of Contents

- [What is This Project?](#what-is-this-project)
- [Key Concepts](#key-concepts)
    - [What is a Server?](#what-is-a-server)
    - [What is an API?](#what-is-an-api)
    - [What is REST?](#what-is-rest)
    - [What is HTTP?](#what-is-http)
    - [HTTP Methods Explained](#http-methods-explained)
    - [HTTP Status Codes](#http-status-codes)
    - [What is JSON?](#what-is-json)
    - [What is a Database?](#what-is-a-database)
    - [What is a CDN?](#what-is-a-cdn)
    - [What is Middleware?](#what-is-middleware)
    - [What is async/await?](#what-is-asyncawait)
    - [What is module.exports / require?](#what-is-moduleexports--require)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
    - [POST /create-post](#1-post-create-post--create-a-new-post)
    - [GET /post](#2-get-post--get-all-posts)
- [Project Structure](#project-structure)
- [Folder Explanations](#folder-explanations)
- [Code Walkthrough — File by File](#code-walkthrough--file-by-file)
- [How a Request Flows Through the App](#how-a-request-flows-through-the-app)
- [How to Add a New Feature](#how-to-add-a-new-feature)

---

## What is This Project?

This project is a **backend server** — a program that runs on a computer (or in the cloud) and responds to requests from other programs (like a mobile app, a website, or Postman).

Think of it like a **restaurant kitchen:**

- A customer (client/browser) places an order (sends an HTTP request)
- The order goes to the kitchen (our backend server)
- The kitchen prepares the food (processes the request, talks to the database)
- The kitchen sends the dish back (sends an HTTP response with data)

**What this specific backend does:**

1. Accepts image uploads and text captions from users
2. Uploads the image to ImageKit (a cloud image hosting service)
3. Saves the image URL and caption to a MongoDB database
4. Returns all saved posts when asked

---

## Key Concepts

### What is a Server?

A **server** is a computer program that waits for and responds to requests from other programs (called **clients**).

```
Client (Browser/App/Postman)          Server (our Node.js app)
        │                                      │
        │──── "Give me all posts" ────────────>│
        │                                      │ (queries database)
        │<──── Here are the posts ─────────────│
        │                                      │
```

- **Client:** The program making the request (a browser, a mobile app, Postman, curl)
- **Server:** The program responding to the request (our Express.js app)
- **Port:** The "door number" on the server. Our server listens on port 3000, so clients send requests to `http://localhost:3000`

**localhost** means "this computer." When you run the server on your machine, `localhost:3000` means "port 3000 on my own computer."

---

### What is an API?

**API** stands for **Application Programming Interface**. It's a set of rules that defines HOW two programs can communicate with each other.

Our API says:

- "If you send a `POST` request to `/create-post` with an image and caption, I'll create a post and send you back the result"
- "If you send a `GET` request to `/post`, I'll send you all the posts"

**Real-world analogy:** A restaurant menu is an API. It tells you:

- What you **can order** (available endpoints)
- **How to order** (what format to send requests in)
- **What you'll receive** (what the response looks like)

---

### What is REST?

**REST** stands for **REpresentational State Transfer**. It's a set of design rules for building APIs. A "RESTful API" follows these rules:

| REST Rule                        | What It Means                                                               | Our Example                                      |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| **Use URLs for resources**       | Each "thing" (resource) has its own URL                                     | `/post` for posts                                |
| **Use HTTP methods for actions** | Different methods = different actions on the same resource                  | `GET /post` = read, `POST /create-post` = create |
| **Stateless**                    | Each request is independent — the server doesn't remember previous requests | Every request must contain all needed info       |
| **Send/receive JSON**            | Data is sent and received as JSON objects                                   | `{"caption": "Hello"}`                           |

**The 4 main REST actions (CRUD):**

| Action     | HTTP Method      | Example            | Meaning                 |
| ---------- | ---------------- | ------------------ | ----------------------- |
| **C**reate | `POST`           | `POST /post`       | Create a new post       |
| **R**ead   | `GET`            | `GET /post`        | Get/read existing posts |
| **U**pdate | `PUT` or `PATCH` | `PUT /post/123`    | Update post #123        |
| **D**elete | `DELETE`         | `DELETE /post/123` | Delete post #123        |

> Our API currently only implements **Create** and **Read**. Update and Delete can be added later.

---

### What is HTTP?

**HTTP** stands for **HyperText Transfer Protocol**. It's the language that browsers and servers speak to each other.

Every HTTP communication has two parts:

**1. The Request** (client → server):

```
POST /create-post HTTP/1.1        ← Method + URL + HTTP version
Host: localhost:3000               ← Which server to talk to
Content-Type: multipart/form-data  ← What format the body is in

[image file data]                  ← The body (the data being sent)
caption=My first post!
```

| Part         | What It Is                     | Example                             |
| ------------ | ------------------------------ | ----------------------------------- |
| **Method**   | The action to perform          | `GET`, `POST`, `PUT`, `DELETE`      |
| **URL/Path** | Which resource to access       | `/create-post`, `/post`             |
| **Headers**  | Metadata about the request     | `Content-Type: application/json`    |
| **Body**     | The data being sent (optional) | `{"caption": "Hello"}` or file data |

**2. The Response** (server → client):

```
HTTP/1.1 201 Created               ← HTTP version + Status Code + Status Text
Content-Type: application/json      ← What format the response is in

{                                   ← The response body (JSON data)
    "message": "Post created successfully",
    "post": { "_id": "abc123", "image": "https://...", "caption": "My first post!" }
}
```

| Part            | What It Is                          | Example                             |
| --------------- | ----------------------------------- | ----------------------------------- |
| **Status Code** | A number indicating success/failure | `200`, `201`, `404`, `500`          |
| **Status Text** | Human-readable status               | `OK`, `Created`, `Not Found`        |
| **Headers**     | Metadata about the response         | `Content-Type: application/json`    |
| **Body**        | The data being returned             | `{"message": "...", "post": {...}}` |

---

### HTTP Methods Explained

HTTP methods tell the server WHAT ACTION to perform. Think of them as verbs:

#### GET — "Give me data"

- **Purpose:** Retrieve/read data from the server
- **Has a body?** No — you don't send any data
- **Safe?** Yes — it doesn't change anything on the server
- **Example:** Opening `http://localhost:3000/post` in your browser sends a `GET` request
- **Real-world analogy:** Reading a menu at a restaurant (you're just looking, not changing anything)

#### POST — "Create something new"

- **Purpose:** Send data to the server to CREATE a new resource
- **Has a body?** Yes — you send the data for the new resource
- **Safe?** No — it changes the server's data (adds a new record)
- **Example:** Submitting a form to create a new post
- **Real-world analogy:** Placing an order at a restaurant (something new is being created)

**What happens inside a POST request in our app:**

```
1. Client sends POST /create-post
   Body contains: image file + caption text

2. Express receives the request

3. Multer middleware reads the image file from the request body
   → Converts it to a Buffer (raw binary data in memory)
   → Attaches it to req.file

4. Controller function runs:
   a. Takes req.file.buffer (the image's raw bytes)
   b. Converts to base64 string (text representation of binary)
   c. Sends to ImageKit API (cloud upload)
   d. ImageKit returns a public URL for the image

5. Controller saves to MongoDB:
   a. Creates a new document: { image: "imagekit_url", caption: "user's text" }
   b. MongoDB assigns a unique _id
   c. MongoDB saves and returns the document

6. Controller sends the response:
   Status: 201 Created
   Body: { message: "Post created successfully", post: { _id, image, caption } }
```

#### PUT — "Replace entirely"

- **Purpose:** Replace an entire resource with new data
- **Has a body?** Yes — the complete new version of the resource
- **Example:** `PUT /post/123` with `{ "image": "new_url", "caption": "new caption" }`
- **Not implemented in our app** (could be added)

#### PATCH — "Update partially"

- **Purpose:** Update specific fields of a resource
- **Has a body?** Yes — only the fields to change
- **Example:** `PATCH /post/123` with `{ "caption": "updated caption" }` (only changes caption)
- **Not implemented in our app** (could be added)

#### DELETE — "Remove it"

- **Purpose:** Delete a resource from the server
- **Has a body?** Usually no
- **Example:** `DELETE /post/123` — deletes post #123
- **Not implemented in our app** (could be added)

---

### HTTP Status Codes

Status codes are 3-digit numbers the server sends back to tell the client what happened. They are grouped by the first digit:

#### 1xx — Informational

| Code  | Name     | Meaning                            |
| ----- | -------- | ---------------------------------- |
| `100` | Continue | "Keep going, I'm still processing" |

#### 2xx — Success ✅

| Code  | Name       | Meaning                                 | When We Use It                             |
| ----- | ---------- | --------------------------------------- | ------------------------------------------ |
| `200` | OK         | Request succeeded, here's the data      | `GET /post` — returning all posts          |
| `201` | Created    | A new resource was successfully created | `POST /create-post` — a new post was saved |
| `204` | No Content | Success, but nothing to return          | After deleting something                   |

#### 3xx — Redirection ↩️

| Code  | Name              | Meaning                                      |
| ----- | ----------------- | -------------------------------------------- |
| `301` | Moved Permanently | This URL has moved to a new location forever |
| `302` | Found             | Temporarily redirecting to another URL       |

#### 4xx — Client Error ❌ (the client did something wrong)

| Code  | Name                 | Meaning                                       |
| ----- | -------------------- | --------------------------------------------- |
| `400` | Bad Request          | The request data is invalid or malformed      |
| `401` | Unauthorized         | Authentication required (not logged in)       |
| `403` | Forbidden            | Authenticated but not allowed to access this  |
| `404` | Not Found            | The URL doesn't exist                         |
| `422` | Unprocessable Entity | Data format is correct but content is invalid |
| `429` | Too Many Requests    | Rate limited — slow down                      |

#### 5xx — Server Error 💥 (the server broke)

| Code  | Name                  | Meaning                                                | When We Use It                  |
| ----- | --------------------- | ------------------------------------------------------ | ------------------------------- |
| `500` | Internal Server Error | Something unexpected went wrong on the server          | When database or ImageKit fails |
| `502` | Bad Gateway           | The server got an invalid response from another server |
| `503` | Service Unavailable   | Server is temporarily down (overloaded or maintenance) |

---

### What is JSON?

**JSON** stands for **JavaScript Object Notation**. It's a text format for structuring data. APIs use it to send and receive data because it's readable by both humans and machines.

**JSON syntax rules:**

```json
{
    "name": "Aditya", // Strings use double quotes
    "age": 22, // Numbers have no quotes
    "isStudent": true, // Booleans: true or false
    "hobbies": ["coding", "gaming"], // Arrays: ordered lists
    "address": {
        // Objects: nested key-value pairs
        "city": "Delhi",
        "country": "India"
    },
    "job": null // null: explicitly empty
}
```

| Type    | Example            | Notes                               |
| ------- | ------------------ | ----------------------------------- |
| String  | `"hello"`          | Must use double quotes (not single) |
| Number  | `42`, `3.14`       | No quotes                           |
| Boolean | `true`, `false`    | No quotes                           |
| Array   | `[1, 2, 3]`        | Ordered list                        |
| Object  | `{"key": "value"}` | Key-value pairs                     |
| Null    | `null`             | Represents nothing                  |

**In our API:**

- Request body: `{ "caption": "My photo" }` ← JSON
- Response body: `{ "message": "Post created successfully", "post": {...} }` ← JSON

---

### What is a Database?

A **database** is a program that stores, organizes, and retrieves data permanently.

**Without a database:** Data lives in memory (RAM) and is lost when the server restarts.
**With a database:** Data is saved to disk and persists forever.

**MongoDB** is a **NoSQL** database. Instead of tables with rows and columns (like SQL databases), it stores data as **documents** (JSON-like objects) in **collections**.

| SQL Term | MongoDB Term | Our Example                                          |
| -------- | ------------ | ---------------------------------------------------- |
| Database | Database     | `backend`                                            |
| Table    | Collection   | `posts`                                              |
| Row      | Document     | `{ "_id": "...", "image": "...", "caption": "..." }` |
| Column   | Field        | `image`, `caption`                                   |

**A Post document in our MongoDB:**

```json
{
    "_id": "ObjectId('65a1b2c3d4e5f6a7b8c9d0e1')",
    "image": "https://ik.imagekit.io/your_id/image.jpg",
    "caption": "My first post!",
    "__v": 0
}
```

| Field     | What It Is                                                                                             | Who Creates It                           |
| --------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `_id`     | A unique identifier for this document (like a primary key in SQL). Example: `65a1b2c3d4e5f6a7b8c9d0e1` | Auto-generated by MongoDB                |
| `image`   | The public URL of the uploaded image                                                                   | Set by our controller (from ImageKit)    |
| `caption` | The text caption for the post                                                                          | Set by our controller (from the request) |
| `__v`     | Version key — Mongoose uses this to track document revisions internally                                | Auto-generated by Mongoose               |

---

### What is a CDN?

**CDN** stands for **Content Delivery Network**. It's a network of servers spread across the world that serve your files (images, videos, etc.) from the server closest to the user.

**Without CDN:** All images served from one server in, say, the USA. Users in India experience slow loading.
**With CDN (ImageKit):** Images are cached and served from a server near the user (e.g., a server in Mumbai for Indian users).

```
Without CDN:
  User in India ──── 200ms ────> Server in USA

With CDN (ImageKit):
  User in India ──── 20ms ────> CDN Edge in Mumbai ──(cached)──> Server in USA
```

---

### What is Middleware?

**Middleware** is a function that runs **between** receiving a request and the controller handling it. Multiple middleware can be chained — each one processes the request and passes it along.

```
Request → [Middleware 1] → [Middleware 2] → [Controller] → Response
```

**Real-world analogy:** Getting into a concert:

1. Security guard checks your bag (middleware 1)
2. Ticket checker scans your ticket (middleware 2)
3. You enter the concert (controller)

If any middleware rejects you (invalid ticket), you never reach the controller.

**In our app, we have two middleware:**

| Middleware               | What It Does                                                     | Applied To                                           |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- |
| `express.json()`         | Parses JSON in request body. Puts the parsed data in `req.body`. | EVERY request (global middleware in app.js)          |
| `upload.single("image")` | Reads uploaded file from form data. Puts the file in `req.file`. | Only `POST /create-post` (route-specific middleware) |

---

### What is async/await?

Some operations take time — like querying a database or uploading a file over the internet. In JavaScript, these are called **asynchronous operations**.

**The problem:** If JavaScript waits for every slow operation, the entire server freezes and can't handle other requests.

**The solution:** `async/await` lets you "pause" a specific function while waiting, without freezing the rest of the program.

```javascript
// ❌ WITHOUT async/await — nested callback hell
uploadFile(buffer, function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    postModel.create({ image: result.url }, function (err, post) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(post);
    });
});

// ✅ WITH async/await — clean, readable, sequential-looking code
const result = await uploadFile(buffer); // Waits for upload
const post = await postModel.create({ image: result.url }); // Waits for save
res.json(post); // Sends response
```

**Rules:**

- `await` can ONLY be used inside an `async` function
- `await` pauses THAT function until the operation completes
- Other requests can still be processed while one function is waiting
- Always wrap `await` operations in `try/catch` for error handling

---

### What is module.exports / require?

Node.js uses a **module system** to share code between files. Every file is a module.

**Exporting** (making code available to other files):

```javascript
// file: math.js
function add(a, b) {
    return a + b;
}

module.exports = add; // Export a single thing
// OR
module.exports = { add, subtract }; // Export multiple things as an object
```

**Importing** (using code from another file):

```javascript
// file: app.js
const add = require("./math"); // Import a single thing
// OR
const { add, subtract } = require("./math"); // Destructure multiple things
```

**Path rules for `require()`:**
| Path Format | Meaning | Example |
| ----------- | ------- | ------- |
| `"./file"` | Current directory | `require("./app")` → `./app.js` |
| `"../file"` | Parent directory | `require("../config/db")` → one folder up, then into config |
| `"express"` | No `./` → it's an npm package | `require("express")` → from `node_modules/` |

---

## Tech Stack

| Technology     | Category      | What It Is                                                               | Why We Use It                                                                                      | npm Package                                 |
| -------------- | ------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Node.js**    | Runtime       | JavaScript runtime that lets you run JS outside the browser, on a server | Powers our backend server — without it, JS only runs in browsers                                   | (not an npm package — installed separately) |
| **Express.js** | Framework     | A minimal, flexible web framework for Node.js                            | Makes creating HTTP servers and API endpoints easy — handles routing, middleware, request/response | `express`                                   |
| **MongoDB**    | Database      | A NoSQL document database — stores data as JSON-like documents           | Stores our posts. Flexible schema, easy to use with JavaScript                                     | (external service, not a package)           |
| **Mongoose**   | ODM Library   | Object Data Modeling library for MongoDB                                 | Gives MongoDB structure with schemas, validation, and easy-to-use query methods                    | `mongoose`                                  |
| **ImageKit**   | Cloud Service | Cloud image storage, optimization, and CDN delivery                      | Stores uploaded images and serves them fast via CDN globally                                       | `@imagekit/nodejs`                          |
| **Multer**     | Middleware    | Express middleware for handling multipart/form-data (file uploads)       | Reads uploaded files from requests and makes them available in our code                            | `multer`                                    |
| **dotenv**     | Config        | Loads environment variables from `.env` into `process.env`               | Keeps secrets (passwords, API keys) out of our source code                                         | `dotenv`                                    |
| **nodemon**    | Dev Tool      | Monitors file changes and auto-restarts the Node.js server               | Speeds up development — no manual server restart after every edit                                  | `nodemon`                                   |

---

## Prerequisites

1. **Node.js** (v18+) — [Download](https://nodejs.org/)
2. **MongoDB Database** — [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud) or local install
3. **ImageKit Account** — [Sign up](https://imagekit.io/) (free tier available)

---

## Installation

```bash
git clone https://github.com/itsadityakr/the-backend.git
cd the-backend/backend
npm install
```

**What each command does:**

- `git clone <url>` — Downloads the entire repository to your computer
- `cd the-backend/backend` — Navigate into the backend directory
- `npm install` — Reads `package.json`, downloads all dependencies into `node_modules/`

---

## Configuration

```bash
cp .env.example .env    # Create your .env from the template
```

Open `.env` and fill in:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxx=
```

| Variable               | What It Is                                                                 | Where to Get It                                   |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| `PORT`                 | Port number the server listens on. `3000` → `http://localhost:3000`        | Choose any (3000, 5000, 8080)                     |
| `MONGODB_URI`          | MongoDB connection string with username, password, host, and database name | MongoDB Atlas → Connect → Drivers → copy          |
| `IMAGEKIT_PRIVATE_KEY` | Secret API key for ImageKit authentication                                 | ImageKit Dashboard → Developer Options → API Keys |

> ⚠️ **Never commit `.env` to Git.** It contains secrets. `.gitignore` already excludes it.

---

## Running the Server

```bash
npm run dev    # Development mode (auto-restarts on file save)
npm start      # Production mode (no auto-restart)
```

**Expected output:**

```
Server is running on http://localhost:3000
Database Connected
```

---

## API Reference

### 1. POST /create-post — Create a New Post

**What this endpoint does:**

1. Receives an image file and a text caption from the client
2. Uploads the image to ImageKit cloud storage
3. Gets back the public URL of the uploaded image
4. Creates a new post document in MongoDB with the image URL and caption
5. Returns the created post to the client

---

**URL:** `http://localhost:3000/create-post`

**HTTP Method:** `POST`

**Content-Type:** `multipart/form-data`

> `multipart/form-data` is the encoding type used for file uploads. Regular JSON (`application/json`) cannot carry files — it's text-only. `multipart/form-data` splits the data into "parts," where each part can be either text or a file.

---

**Request Fields:**

| Field Name | Type          | Required | Description                                                                                                                 |
| ---------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `image`    | File (binary) | Yes      | The image file to upload. Can be .jpg, .png, .gif, .webp, etc. This is a file picked from your computer, not a URL or text. |
| `caption`  | Text (string) | Yes      | A text description for the post. Sent as a regular text field in the form data.                                             |

---

**How to test with cURL (command line):**

```bash
curl -X POST http://localhost:3000/create-post \
  -F "image=@./photo.jpg" \
  -F "caption=My first post!"
```

| Part                                | Meaning                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `curl`                              | A command-line tool for making HTTP requests                                             |
| `-X POST`                           | Use the POST method                                                                      |
| `http://localhost:3000/create-post` | The URL to send the request to                                                           |
| `-F "image=@./photo.jpg"`           | `-F` means form-data. `@` means "read this file." Sends `photo.jpg` as the `image` field |
| `-F "caption=My first post!"`       | Sends the text "My first post!" as the `caption` field                                   |

---

**How to test with Postman (GUI tool):**

1. Open Postman
2. Click **"New Request"**
3. Set method dropdown to **POST**
4. Enter URL: `http://localhost:3000/create-post`
5. Go to **Body** tab
6. Select **form-data** (not raw, not x-www-form-urlencoded)
7. Add first row:
    - Key: `image`
    - Change the type dropdown (next to key) from "Text" to **"File"**
    - Click "Select Files" → pick an image from your computer
8. Add second row:
    - Key: `caption`
    - Type: Text (default)
    - Value: `My first post!`
9. Click **Send**

---

**✅ Success Response:**

**Status Code:** `201 Created`

**Response Body:**

```json
{
    "message": "Post created successfully",
    "post": {
        "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
        "image": "https://ik.imagekit.io/your_imagekit_id/image.jpg",
        "caption": "My first post!",
        "__v": 0
    }
}
```

| Field          | Type   | Description                                                                                                                                                                                           |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`      | String | Human-readable success message. Always `"Post created successfully"` for this endpoint.                                                                                                               |
| `post`         | Object | The newly created post document as saved in MongoDB. Contains all fields including auto-generated ones.                                                                                               |
| `post._id`     | String | **MongoDB ObjectId** — a unique 24-character hex identifier automatically generated by MongoDB. No two documents ever have the same `_id`. Used to fetch, update, or delete this specific post later. |
| `post.image`   | String | **ImageKit CDN URL** — the public URL where the uploaded image can be viewed. This URL is globally accessible and served from ImageKit's CDN for fast loading.                                        |
| `post.caption` | String | The caption text you sent in the request. Stored exactly as provided.                                                                                                                                 |
| `post.__v`     | Number | **Mongoose version key** — an internal counter that Mongoose uses to track how many times this document has been modified. Starts at `0` for new documents. You can ignore this field.                |

---

**❌ Error Responses:**

**Scenario 1: No image file attached**

```json
{
    "message": "Error creating post",
    "error": "Cannot read properties of undefined (reading 'buffer')"
}
```

**Why:** `req.file` is `undefined` because no file was attached. When the code tries `req.file.buffer`, it crashes.

**Scenario 2: Invalid ImageKit API key**

```json
{
    "message": "Error creating post",
    "error": "Your ImageKit private key is invalid."
}
```

**Why:** The `IMAGEKIT_PRIVATE_KEY` in `.env` is wrong or expired.

**Scenario 3: Database connection lost**

```json
{
    "message": "Error creating post",
    "error": "buffering timed out after 10000ms"
}
```

**Why:** MongoDB is unreachable (network issue, wrong URI, or cluster is paused).

---

**Internal processing steps (what the code does):**

```
Step 1: Express receives POST /create-post
        └── express.json() middleware runs (parses JSON — not needed here since it's form-data)

Step 2: Route matches → runs upload.single("image") middleware
        └── Multer reads the multipart/form-data body
        └── Finds the field named "image" which contains a file
        └── Reads the file bytes into a Buffer (raw binary in memory)
        └── Sets req.file = {
              fieldname: "image",
              originalname: "photo.jpg",
              encoding: "7bit",
              mimetype: "image/jpeg",
              buffer: <Buffer ff d8 ff e0 00 10 ...>,  ← raw bytes of the image
              size: 245678  ← file size in bytes
            }
        └── Sets req.body.caption = "My first post!"

Step 3: Route calls createPost controller
        └── const result = await uploadFile(req.file.buffer)
            └── Converts Buffer to base64: "R0lGODlhAQABAIAA..." (text version of binary)
            └── Sends HTTP POST to ImageKit API with the base64 data
            └── ImageKit stores the image and returns:
                {
                  url: "https://ik.imagekit.io/.../image.jpg",
                  fileId: "abc123",
                  name: "image.jpg",
                  ...
                }

Step 4: Controller creates MongoDB document
        └── const post = await postModel.create({
              image: "https://ik.imagekit.io/.../image.jpg",
              caption: "My first post!"
            })
        └── Mongoose validates data against the schema
        └── Mongoose sends INSERT operation to MongoDB
        └── MongoDB assigns _id: "65a1b2c3d4e5f6a7b8c9d0e1"
        └── MongoDB saves the document to the "posts" collection
        └── Returns the saved document

Step 5: Controller sends response
        └── res.status(201).json({
              message: "Post created successfully",
              post: { _id: "...", image: "...", caption: "...", __v: 0 }
            })
        └── Express converts the object to JSON string
        └── Sends HTTP response with status 201 and the JSON body
```

---

### 2. GET /post — Get All Posts

**What this endpoint does:**

1. Queries MongoDB for all documents in the `posts` collection
2. Returns them as a JSON array

---

**URL:** `http://localhost:3000/post`

**HTTP Method:** `GET`

**Content-Type:** None needed — GET requests don't have a body

**Request Fields:** None — just send the request to the URL

---

**How to test:**

```bash
# With cURL
curl http://localhost:3000/post

# With browser — just open this URL:
# http://localhost:3000/post
```

In **Postman:** Set method to `GET`, URL to `http://localhost:3000/post`, click Send.

---

**✅ Success Response (with posts):**

**Status Code:** `200 OK`

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

**✅ Success Response (no posts yet):**

```json
{
    "message": "Posts fetched successfully",
    "posts": []
}
```

| Field              | Type   | Description                                                                        |
| ------------------ | ------ | ---------------------------------------------------------------------------------- |
| `message`          | String | Human-readable success message                                                     |
| `posts`            | Array  | Array of all post objects in the database. Empty array `[]` if no posts exist yet. |
| `posts[0]._id`     | String | Unique MongoDB identifier for this post                                            |
| `posts[0].image`   | String | Public ImageKit CDN URL for the image                                              |
| `posts[0].caption` | String | Text caption for the post                                                          |
| `posts[0].__v`     | Number | Mongoose version key (internal, can be ignored)                                    |

> **Note:** `posts[0]` means "the first item in the posts array." `posts[1]` is the second, etc.

---

**❌ Error Response:**

```json
{
    "message": "Error fetching posts",
    "error": "connection timed out"
}
```

---

**Internal processing steps:**

```
Step 1: Express receives GET /post
        └── express.json() middleware runs (nothing to parse)

Step 2: Route matches → calls getPosts controller directly (no upload middleware needed)

Step 3: Controller queries database
        └── const posts = await postModel.find()
        └── Mongoose translates .find() to a MongoDB query
        └── MongoDB scans the "posts" collection
        └── Returns all documents as an array of JavaScript objects

Step 4: Controller sends response
        └── res.status(200).json({
              message: "Posts fetched successfully",
              posts: [ { _id: "...", image: "...", caption: "..." }, ... ]
            })
```

---

## Project Structure

```
the-backend/
│
├── backend/                            ← All backend code
│   ├── server.js                       ← 🚀 Entry point — starts the server
│   ├── package.json                    ← 📦 Project dependencies and scripts
│   ├── package-lock.json               ← 🔒 Exact locked dependency versions
│   ├── .env                            ← 🔑 Secrets (NOT in Git)
│   ├── .env.example                    ← 📋 Template for .env
│   │
│   └── src/                            ← 📁 Source code
│       ├── app.js                      ← 🧠 Express setup + middleware + routes
│       ├── config/                     ← ⚙️ Configuration
│       │   └── db.js                   ← Database connection
│       ├── routes/                     ← 🛤️ URL → function mapping
│       │   └── post.routes.js          ← POST /create-post, GET /post
│       ├── controllers/                ← 🎮 Business logic
│       │   └── post.controller.js      ← createPost(), getPosts()
│       ├── middlewares/                ← 🔧 Request preprocessors
│       │   └── upload.middleware.js    ← Multer file upload config
│       ├── models/                     ← 📐 Database schemas
│       │   └── post.model.js           ← Post: { image, caption }
│       └── services/                   ← 🌐 External integrations
│           └── storage.service.js      ← ImageKit upload function
│
├── postman/                            ← Postman API tests
├── .gitignore                          ← Git ignore rules
├── LICENSE
└── README.md
```

---

## Folder Explanations

### `backend/` — Why a separate folder?

Contains all backend server code. In a full-stack project, you might also have `frontend/` for the UI. Keeps things organized.

### `src/` — Why separate source code?

Short for "source." Separates YOUR code from config files (`package.json`, `.env`). Everything you write goes here. Config stays at root.

### `src/config/` — Why a config folder?

**Config = how your app connects to things.** Database connections, API client setup, app settings. If someone asks "how does the app connect to MongoDB?" → look here. Not business logic, just setup.

### `src/routes/` — Why a routes folder?

**Routes = your API's table of contents.** Each file maps URLs to functions. By looking in this folder, you can see EVERY endpoint your API offers. Routes don't contain logic — they just point to controllers.

### `src/controllers/` — Why a controllers folder?

**Controllers = the brain.** They contain the actual logic: receive the request, process data, talk to database, send response. Separated from routes so routes stay short and controllers are testable independently.

### `src/middlewares/` — Why a middlewares folder?

**Middleware = preprocessing.** Functions that run BEFORE the controller. File upload handling, authentication checks, logging, etc. Reusable across routes. Change config in one place → affects all routes using it.

### `src/models/` — Why a models folder?

**Models = data blueprints.** Defines what your data looks like in the database. Each file = one MongoDB collection. When you need to know what data fields exist → look here.

### `src/services/` — Why a services folder?

**Services = external API wrappers.** Handles communication with third-party systems (ImageKit, email, payment). If you switch providers, only this file changes — nothing else.

---

## Code Walkthrough — File by File

> Each file in the project has detailed inline comments explaining every line. Open any file to see comprehensive explanations directly in the code.

### File Execution Order

When you run `npm run dev`, here's the order files execute:

```
1. package.json      → tells Node to run server.js
2. server.js          → imports app.js and db.js
3. src/app.js         → loads dotenv, imports routes, creates Express app
4. src/config/db.js   → called by server.js, connects to MongoDB
5. (server starts listening on PORT)

When POST /create-post is received:
6. src/routes/post.routes.js        → matches URL, chains middleware + controller
7. src/middlewares/upload.middleware.js → Multer reads the file
8. src/controllers/post.controller.js  → runs createPost()
9. src/services/storage.service.js     → uploads to ImageKit
10. src/models/post.model.js           → saves to MongoDB
```

---

## How a Request Flows Through the App

```
Client (Postman / Browser / curl / Mobile App)
    │
    │  POST /create-post
    │  Body: image file + "My first post!"
    │
    ▼
┌─────────────────────────────────────────────┐
│  server.js                                   │
│  The app is listening on PORT 3000           │
│  Receives the raw HTTP request               │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/app.js                                  │
│  ① express.json() → parses JSON bodies       │
│  ② URL "/" matched → forwards to postRoutes  │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/routes/post.routes.js                   │
│  POST "/create-post" matched                 │
│  ① Runs upload.single("image") middleware    │
│  ② Then runs createPost controller           │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/middlewares/upload.middleware.js         │
│  Multer reads the image file from the body   │
│  Stores the raw bytes in memory as a Buffer  │
│  Sets req.file = { buffer, originalname, ... }│
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/controllers/post.controller.js          │
│  ① Gets req.file.buffer (image binary data)  │
│  ② Calls uploadFile(buffer)                  │
│     └─ Goes to storage.service.js            │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/services/storage.service.js             │
│  ① Converts buffer to base64 string          │
│  ② Sends to ImageKit API (cloud upload)      │
│  ③ ImageKit returns { url, fileId, ... }     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/controllers/post.controller.js          │
│  ③ Gets result.url from ImageKit             │
│  ④ Calls postModel.create({image, caption})  │
│     └─ Goes to post.model.js                 │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/models/post.model.js                    │
│  Mongoose validates data against schema      │
│  MongoDB saves document to "posts" collection│
│  Returns saved document with _id             │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  src/controllers/post.controller.js          │
│  ⑤ Sends response:                           │
│     Status: 201 Created                      │
│     Body: { message, post }                  │
└──────────────────┬──────────────────────────┘
                   ▼
Client receives JSON response ✅
```

---

## How to Add a New Feature

**Example:** Adding a Users resource with `POST /users` and `GET /users`.

**Step 1:** Create model → `src/models/user.model.js`

```javascript
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({ name: String, email: String });
module.exports = mongoose.model("User", userSchema);
```

**Step 2:** Create controller → `src/controllers/user.controller.js`

```javascript
const User = require("../models/user.model");
const createUser = async (req, res) => {
    /* logic */
};
const getUsers = async (req, res) => {
    /* logic */
};
module.exports = { createUser, getUsers };
```

**Step 3:** Create routes → `src/routes/user.routes.js`

```javascript
const router = require("express").Router();
const { createUser, getUsers } = require("../controllers/user.controller");
router.post("/users", createUser);
router.get("/users", getUsers);
module.exports = router;
```

**Step 4:** Mount in `src/app.js`

```javascript
const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);
```

---

## License

[ISC](LICENSE)
