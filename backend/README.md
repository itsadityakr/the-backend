# The Backend

A RESTful API built with **Express.js**, **MongoDB**, and **ImageKit** for creating and fetching posts with image uploads.

---

## Tech Stack

| Technology     | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| **Node.js**    | JavaScript runtime — runs your server-side code                          |
| **Express.js** | Web framework — handles HTTP requests and routing                        |
| **MongoDB**    | NoSQL database — stores your data as JSON-like documents                 |
| **Mongoose**   | ODM (Object Data Modeling) — provides schemas and validation for MongoDB |
| **ImageKit**   | Cloud image service — stores and serves uploaded images via CDN          |
| **Multer**     | Middleware — handles file uploads from HTML forms                        |
| **dotenv**     | Config loader — reads `.env` file into `process.env`                     |
| **nodemon**    | Dev tool — auto-restarts the server when you save files                  |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- An [ImageKit](https://imagekit.io/) account

### Installation

```bash
git clone https://github.com/itsadityakr/the-backend.git
cd the-backend
npm install
```

### Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable               | Description                   |
| ---------------------- | ----------------------------- |
| `PORT`                 | Server port (default: `3000`) |
| `MONGODB_URI`          | MongoDB connection string     |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key      |

### Running

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

---

## API Endpoints

| Method | Endpoint       | Description       | Body                             |
| ------ | -------------- | ----------------- | -------------------------------- |
| POST   | `/create-post` | Create a new post | `image` (file), `caption` (text) |
| GET    | `/post`        | Get all posts     | —                                |

---

## Project Structure — Explained

```
the-backend/
│
├── server.js                          ← Entry point (starts the server)
├── package.json                       ← Project config and dependencies
├── .env                               ← Secret environment variables (not committed)
├── .env.example                       ← Template for .env (safe to commit)
│
├── src/                               ← ALL source code lives here
│   ├── app.js                         ← Express app setup and middleware registration
│   │
│   ├── config/                        ← Configuration files
│   │   └── db.js                      ← MongoDB database connection
│   │
│   ├── routes/                        ← API route definitions
│   │   └── post.routes.js             ← Maps URLs to controller functions
│   │
│   ├── controllers/                   ← Request handler logic
│   │   └── post.controller.js         ← Business logic for post endpoints
│   │
│   ├── middlewares/                    ← Reusable middleware functions
│   │   └── upload.middleware.js        ← Multer file upload configuration
│   │
│   ├── models/                        ← Database schemas
│   │   └── post.model.js              ← Post data structure definition
│   │
│   └── services/                      ← External service integrations
│       └── storage.service.js         ← ImageKit file upload logic
│
├── postman/                           ← Postman collection for API testing
├── LICENSE
└── README.md
```

---

## Why This Folder Structure? (Explained for Beginners)

### `server.js` — The Entry Point

**What:** The first file that runs when you type `npm start`.
**Why at root:** It's the "front door" of your app. Keeping it at the root makes it obvious where the app starts. `package.json` points to it via the `"main"` field.
**What it does:** Connects to the database and starts the HTTP server.

---

### `src/` — Source Code Directory

**What:** Contains ALL your application source code.
**Why:** Separating source code from config files (`package.json`, `.env`, `.gitignore`) keeps the root clean. Everything you write goes in `src/`.

---

### `src/app.js` — Application Setup

**What:** Creates and configures the Express application.
**Why in `src/` root:** It's the central hub — all routes and middleware plug into it. It's separate from `server.js` so you can import the app in tests without starting a real server.
**What it does:**

1. Loads environment variables
2. Creates the Express app
3. Adds global middleware (JSON parsing)
4. Mounts route files

---

### `src/config/` — Configuration

**What:** Stores configuration and setup files. Database connections, API client setup, app settings, etc.
**Why a separate folder:** Configuration is not business logic. If you need to change HOW you connect to a database, you only look here — not in your routes or controllers.

#### `db.js`

Connects to MongoDB using Mongoose and the `MONGODB_URI` from `.env`.

---

### `src/routes/` — Route Definitions

**What:** Maps URL paths + HTTP methods to controller functions.
**Why a separate folder:** Routes are like a "table of contents" for your API. By keeping them separate, you can open one file and see ALL available endpoints at a glance.
**Analogy:** A route is like a phone directory — it maps a "number" (URL) to a "person" (controller function).

#### `post.routes.js`

```
POST /create-post → upload middleware → createPost controller
GET  /post        → getPosts controller
```

---

### `src/controllers/` — Request Handlers

**What:** Contains the actual business logic that runs when someone hits an API endpoint.
**Why a separate folder:** Controllers are the "brain" of your API. By separating them from routes:

- Routes stay short and readable (just URL → function)
- Logic is reusable across different routes
- Easier to test in isolation

**Analogy:** If the route is a "phone directory entry," the controller is the "person who answers the phone."

#### `post.controller.js`

- `createPost()` — uploads an image to ImageKit, saves the post to MongoDB, returns the new post
- `getPosts()` — fetches all posts from MongoDB and returns them

---

### `src/middlewares/` — Middleware Functions

**What:** Functions that run BETWEEN receiving a request and the controller handling it.
**Why a separate folder:** Middleware is reusable "preprocessing" logic. Keeping it separate means any route can use it, and you change it in one place.
**Analogy:** Middleware is like airport security — before you board (reach the controller), you pass through checks (middleware).

#### `upload.middleware.js`

Configures Multer to store uploaded files in memory (as Buffers). When applied to a route, it reads the file from the request and makes it available as `req.file`.

---

### `src/models/` — Database Schemas

**What:** Defines the structure of your data in MongoDB using Mongoose schemas.
**Why a separate folder:** Models are your "data blueprints." Each model file = one MongoDB collection. When you need to change your data structure, you know exactly where to go.
**Analogy:** A model is like a form template — it defines what fields exist and what type of data goes in each field.

#### `post.model.js`

Defines the Post schema:

- `image` (String) — URL of the uploaded image
- `caption` (String) — text description of the post

Creates a `"posts"` collection in MongoDB.

---

### `src/services/` — External Service Integrations

**What:** Handles communication with external APIs/services (ImageKit, email providers, payment gateways, etc.).
**Why a separate folder:** Services hide the technical details of HOW you talk to external systems. If you switch from ImageKit to AWS S3, you only change this one file — nothing else in your app is affected.
**Analogy:** A service is like a translator — your controller speaks plain JavaScript, the service translates that into whatever the external API needs.

#### `storage.service.js`

Creates an ImageKit client and exports an `uploadFile()` function that:

1. Takes a file Buffer (raw binary data)
2. Converts it to base64
3. Uploads it to ImageKit
4. Returns the result (including the public URL)

---

## How a Request Flows Through the App

Here's what happens when a user sends `POST /create-post` with an image:

```
1. User sends HTTP request
        ↓
2. server.js is already running and listening on PORT
        ↓
3. Express (app.js) receives the request
        ↓
4. app.js matches the URL "/create-post" → sends to post.routes.js
        ↓
5. post.routes.js runs the upload middleware first
   → Multer reads the image file and puts it in req.file
        ↓
6. post.routes.js then runs the createPost controller
   → Controller calls storage.service.js to upload the image to ImageKit
   → Controller calls post.model.js to save the post to MongoDB
   → Controller sends back the response
        ↓
7. User receives: { message: "Post created successfully", post: {...} }
```

---

## Adding New Features

To add a **new resource** (e.g., Users), create these files:

1. `src/models/user.model.js` — define the User schema
2. `src/controllers/user.controller.js` — write the handler logic
3. `src/routes/user.routes.js` — define the URL endpoints
4. Update `src/app.js` — mount the new routes: `app.use("/", userRoutes)`

---

## License

[ISC](LICENSE)
