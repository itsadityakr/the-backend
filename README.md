# The Backend — Full-Stack Image Sharing App

A beginner-friendly, production-ready full-stack application built with **React** (frontend) and **Express.js + MongoDB + ImageKit** (backend). Users can upload images with captions and view them in a feed.

---

## What Does This App Do?

1. **Create Posts** — Upload an image + write a caption
2. **View Feed** — See all posts in a beautiful card layout
3. **Cloud Storage** — Images are stored on ImageKit (CDN) for fast delivery

---

## Prerequisites — What You Need to Know First

Before you start, you should know the basics of:

- **HTML** — The language that creates the structure of web pages (headings, paragraphs, buttons, forms)
- **CSS** — The language that makes web pages look pretty (colors, sizes, layouts, animations)
- **JavaScript** — The programming language that makes web pages interactive (click handlers, form submissions, fetching data)
- **Terminal / Command Line** — A text-based way to run commands on your computer (like `cd`, `npm install`, etc.)

If you don't know these yet, that's OK! Learn them first, then come back here.

---

## ️ Tech Stack — Tools Used in This Project

A "tech stack" is the collection of technologies used to build an application. Here's every tool in this project:

| Layer             | Technology     | What It Is                                        | Why We Use It                                                                                 |
| ----------------- | -------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Frontend**      | React 19       | A JavaScript library for building user interfaces | Makes it easy to create interactive UIs by breaking them into reusable "components"           |
| **Build Tool**    | Vite 7         | A development server and bundler                  | Serves our app during development with instant hot-reloading; bundles files for production    |
| **Styling**       | Tailwind CSS 4 | A utility-first CSS framework                     | Provides pre-built CSS utility classes (though we mainly use custom CSS in this project)      |
| **HTTP Client**   | Axios          | A library for making HTTP requests                | Lets the frontend send data to and receive data from the backend API                          |
| **Routing**       | React Router 7 | A library for page navigation in React            | Lets users navigate between pages (like /feed and /create-post) without page reloads          |
| **Backend**       | Express.js 5   | A web framework for Node.js                       | Makes it easy to create an HTTP server that handles API requests                              |
| **Database**      | MongoDB        | A NoSQL document database                         | Stores our post data (image URLs, captions, timestamps)                                       |
| **ODM**           | Mongoose 9     | An Object Data Modeling library for MongoDB       | Provides schemas, validation, and a clean API for interacting with MongoDB from JavaScript    |
| **Cloud Storage** | ImageKit       | A cloud-based image storage and CDN               | Stores uploaded images and serves them fast via Content Delivery Network                      |
| **File Uploads**  | Multer 2       | A middleware for handling file uploads            | Reads uploaded files from HTTP requests and makes them available in our code                  |
| **Environment**   | dotenv         | A library for loading environment variables       | Reads secret values from a `.env` file into `process.env`                                     |
| **CORS**          | cors           | A middleware for Cross-Origin Resource Sharing    | Allows the frontend (on port 5173) to make requests to the backend (on port 3000)             |
| **Auto-Restart**  | Nodemon        | A development tool that watches for file changes  | Automatically restarts the backend server when you save a file (only used during development) |

---

## Project Folder Structure — What Each File and Folder Is For

```
the-backend/                         ← Root folder of the entire project
│
├── README.md                         ← This file! Project overview and documentation
├── LICENSE                           ← Legal license (ISC) for the code
├── .gitignore                        ← Tells Git which files/folders to ignore (like node_modules)
│
├── backend/                          ← ️ The backend API server (Express.js)
│   ├── server.js                     ← ENTRY POINT: starts the server and connects to database
│   ├── package.json                  ← Lists dependencies and npm scripts for the backend
│   ├── package-lock.json             ← Locks exact dependency versions (auto-generated, don't edit)
│   ├── .env                          ← Secret values (database URL, API keys) — NOT committed to Git
│   ├── .env.example                  ← Template showing what .env should look like (safe to commit)
│   ├── README.md                     ← Detailed backend documentation
│   │
│   └── src/                          ← All source code lives here (organized by responsibility)
│       ├── app.js                    ← Creates and configures the Express app (middleware + routes)
│       │
│       ├── config/                   ← Configuration files (settings and connections)
│       │   ├── constants.js          ← All "magic values" in one place (file size limits, HTTP codes)
│       │   └── db.js                 ← MongoDB database connection setup
│       │
│       ├── controllers/              ← Business logic (what happens when an API endpoint is hit)
│       │   └── post.controller.js    ← Logic for creating and fetching posts
│       │
│       ├── middlewares/              ← Functions that run BETWEEN request and response
│       │   ├── error.middleware.js   ← Catches all errors and sends proper error responses
│       │   └── upload.middleware.js  ← Handles file uploads (reads files from requests)
│       │
│       ├── models/                   ← Database schemas (define the structure of your data)
│       │   └── post.model.js         ← Defines what a "Post" looks like in the database
│       │
│       ├── routes/                   ← URL definitions (which URLs trigger which controllers)
│       │   └── post.routes.js        ← Maps URLs to controller functions
│       │
│       └── services/                 ← External service integrations (third-party APIs)
│           └── storage.service.js    ← Uploads images to ImageKit cloud storage
│
├── frontend/                         ←  The frontend UI application (React)
│   ├── index.html                    ← The ONE HTML page (React renders inside it)
│   ├── vite.config.js                ← Vite build tool configuration
│   ├── package.json                  ← Lists dependencies and npm scripts for the frontend
│   ├── package-lock.json             ← Locks exact dependency versions (auto-generated)
│   ├── .env.example                  ← Template for frontend environment variables
│   ├── .gitignore                    ← Tells Git to ignore node_modules, dist, etc.
│   ├── eslint.config.js              ← ESLint code quality checker configuration
│   ├── README.md                     ← Detailed frontend documentation
│   │
│   └── src/                          ← All React source code
│       ├── main.jsx                  ← ENTRY POINT: mounts React app into the HTML page
│       ├── App.jsx                   ← Main component: sets up page routing
│       ├── index.css                 ← Global styles for the entire app
│       │
│       ├── config/                   ← Configuration files
│       │   └── api.js                ← Centralized Axios HTTP client setup
│       │
│       └── pages/                    ← Page components (one per route/URL)
│           ├── CreatePost.jsx        ← Form page for creating a new post
│           └── Feed.jsx              ← Feed page that displays all posts
│
└── postman/                          ← Postman API testing collection
    └── the-backend.postman_collection.json
```

### Why This Folder Structure?

This structure follows the **"Separation of Concerns"** principle — each folder has ONE job:

- **config/** → How to connect to things (database, constants)
- **controllers/** → What to DO when a request comes in (business logic)
- **middlewares/** → What checks to run BEFORE the controller (validation, error handling)
- **models/** → What the DATA looks like (database structure)
- **routes/** → Which URLs exist and where they go
- **services/** → How to talk to EXTERNAL services (ImageKit, email, etc.)

This makes the code easier to find, read, and maintain as the project grows.

---

## Quick Start — How to Run the App

### Step 1: Install Node.js

Node.js lets you run JavaScript outside the browser (on your computer/server).

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS** (Long Term Support) version
3. Install it
4. Verify in your terminal: `node --version` (should show v18 or higher)

### Step 2: Get a MongoDB Database

MongoDB is where your app stores data. The easiest option is **MongoDB Atlas** (free cloud database):

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a free cluster (server)
4. Create a database user with a username and password
5. Get your **Connection String** — it looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/the-backend`

### Step 3: Get an ImageKit Account

ImageKit stores your uploaded images in the cloud:

1. Go to [https://imagekit.io/](https://imagekit.io/)
2. Sign up for a free account
3. Go to Settings → API Keys
4. Copy your **Private Key**

### Step 4: Clone and Set Up the Backend

```bash
git clone https://github.com/itsadityakr/the-backend.git
cd the-backend/backend
npm install                     # Downloads all dependencies into node_modules/
cp .env.example .env            # Creates your .env file from the template
```

Edit `.env` and fill in your values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/the-backend
IMAGEKIT_PRIVATE_KEY=your_private_key_here
```

Start the backend:

```bash
npm run dev    # Starts with auto-reload (for development)
# OR
npm start      # Starts normally (for production)
```

You should see:

```
 Database Connected Successfully
 Mongoose connected to MongoDB
 Server is running on http://localhost:3000
```

### Step 5: Set Up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

You should see:

```
VITE v7.x.x  ready in Xms
  Local:   http://localhost:5173/
```

### Step 6: Use the App!

- **Create a post**: Open `http://localhost:5173/create-post`
- **View all posts**: Open `http://localhost:5173/feed`
- **Health check**: Open `http://localhost:3000/health`

---

## API Reference — All Available Endpoints

An "endpoint" is a specific URL that the backend responds to. "API" stands for Application Programming Interface — it's how the frontend talks to the backend.

| Method | Full URL                                | Description                | What You Send                     | What You Get Back                                    |
| ------ | --------------------------------------- | -------------------------- | --------------------------------- | ---------------------------------------------------- |
| GET    | `http://localhost:3000/health`          | Check if server is running | Nothing                           | `{ success: true, message: "Server is healthy..." }` |
| POST   | `http://localhost:3000/api/create-post` | Create a new post          | `image` (file) + `caption` (text) | `{ success: true, post: {...} }`                     |
| GET    | `http://localhost:3000/api/post`        | Get all posts              | Nothing                           | `{ success: true, posts: [...], count: N }`          |

### Example Response — GET /api/post

```json
{
    "success": true,
    "message": "Posts fetched successfully",
    "count": 2,
    "posts": [
        {
            "_id": "65a4b3c2d1e2f3a4b5c6d7e8",
            "image": "https://ik.imagekit.io/your_id/image_1705312200000.jpg",
            "caption": "My awesome post!",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

---

## How Data Flows Through the App

Here's what happens step-by-step when a user creates a post:

```
    ┌─ User's Browser ──────────────────────────────┐
    │                                                │
    │  1. User selects image + writes caption        │
    │  2. Clicks "Post to Feed"                      │
    │  3. React sends POST request via Axios          │
    │                                                │
    └──────────────┬─────────────────────────────────┘
                   │
                   │  HTTP POST /api/create-post
                   │  (image file + caption text)
                   │
    ┌──────────────▼─────────────────────────────────┐
    │        Backend (Express.js Server)              │
    │                                                │
    │  4. CORS middleware → allows the request        │
    │  5. Router matches /api/create-post             │
    │  6. Multer reads the image file                 │
    │     → Checks file type (images only)            │
    │     → Checks file size (max 5MB)                │
    │  7. Controller validates caption exists          │
    │  8. Service uploads image to ImageKit            │
    │  9. Controller saves post to MongoDB             │
    │  10. Sends success response back                │
    │                                                │
    └──────────┬──────────────┬──────────────────────┘
               │              │
        ┌──────▼──────┐  ┌───▼────────┐
        │  ImageKit   │  │  MongoDB   │
        │  (stores    │  │  (stores   │
        │   image)    │  │   post     │
        │             │  │   data)    │
        └─────────────┘  └────────────┘
```

---

## Detailed Documentation

For line-by-line code explanations, see:

- **[Backend README →](./backend/README.md)** — Every backend file explained line by line
- **[Frontend README →](./frontend/README.md)** — Every frontend file explained line by line

---

## License

[ISC](LICENSE)
