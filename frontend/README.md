# Frontend — React UI Application (Detailed Documentation)

This document explains **every single file, every line of code, every import, and every concept** in the frontend. If you're an absolute beginner, read through this from top to bottom.

---

## Frontend Folder Structure

```
frontend/
├── index.html                ← The ONE HTML page (React renders inside it)
├── vite.config.js            ← Vite build tool configuration
├── package.json              ← Dependencies and npm scripts
├── .env.example              ← Template for environment variables
├── eslint.config.js          ← Code quality linter configuration
│
└── src/                      ← All React source code
    ├── main.jsx              ← ENTRY POINT — mounts React into the HTML
    ├── App.jsx               ← Main component — sets up page routing
    ├── index.css             ← Global styles for the entire app
    │
    ├── config/               ← Configuration files
    │   └── api.js            ← API helper functions (apiGet, apiPost)
    │
    └── pages/                ← Page components (one per URL/route)
        ├── CreatePost.jsx    ← Form for creating new posts
        └── Feed.jsx          ← Displays all posts from the API
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file (copy the example)
cp .env.example .env

# 3. Start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## package.json — Frontend Dependencies

```json
{
    "name": "vite-project",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview"
    },
    "dependencies": {
        "@tailwindcss/vite": "...",
        "axios": "...",
        "lucide-react": "...",
        "react": "...",
        "react-dom": "...",
        "react-router-dom": "...",
        "tailwindcss": "..."
    }
}
```

| Field                       | What It Means                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `"type": "module"`          | Use `import` / `export` syntax (ES Modules). The backend uses `"commonjs"` with `require()`, but modern frontend projects use ES Modules. |
| `"dev": "vite"`             | `npm run dev` → starts the Vite development server with hot reload                                                                        |
| `"build": "vite build"`     | `npm run build` → bundles everything into optimized files in `dist/` folder                                                               |
| `"lint": "eslint ."`        | `npm run lint` → checks code for errors and style issues                                                                                  |
| `"preview": "vite preview"` | `npm run preview` → preview the production build locally                                                                                  |

### What Each Dependency Does

| Package             | What It Is                   | Why We Need It                                                         |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `react`             | The React library            | Core library for building UI components                                |
| `react-dom`         | React's DOM rendering engine | Connects React components to actual HTML elements in the browser       |
| `react-router-dom`  | React Router                 | Enables page navigation (show different components for different URLs) |
| `axios`             | HTTP request library         | Makes API calls to the backend (alternative to `fetch()`)              |
| `tailwindcss`       | CSS utility framework        | Provides utility classes for styling (we mainly use custom CSS though) |
| `@tailwindcss/vite` | Tailwind's Vite plugin       | Integrates Tailwind CSS processing into Vite's build pipeline          |
| `lucide-react`      | Icon library                 | Provides ready-to-use SVG icons as React components                    |

---

## ️Environment Variables

### .env.example:

```env
VITE_API_URL=http://localhost:3000/api
```

- **`VITE_API_URL`** — The URL of the backend API.
- **Why `VITE_` prefix?** Vite only exposes environment variables that start with `VITE_` to the browser code. This is a security feature — your other env vars (secrets, database URLs) don't get leaked to the client.
- **How to use it in code:** `import.meta.env.VITE_API_URL`

---

## File-by-File Code Walkthrough

---

### 1. `index.html` — The One and Only HTML File

React apps are **Single Page Applications (SPA)**. There is only ONE HTML file. React dynamically changes the content using JavaScript.

```html
<!doctype html>
```

- **What:** Declares this as an HTML5 document. Every HTML file starts with this.

```html
<html lang="en"></html>
```

- **`lang="en"`** — Tells browsers and search engines the page is in English. Used for accessibility (screen readers) and SEO.

```html
<meta charset="UTF-8" />
```

- **What:** Sets the character encoding to UTF-8 (supports all languages, symbols, and emoji).

```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

- **What:** Sets the favicon — the small icon shown in the browser tab next to the page title.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- **What:** Makes the page responsive on mobile devices.
- **`width=device-width`** — Set the page width to the device's screen width (not a fixed desktop width).
- **`initial-scale=1.0`** — Don't zoom in or out initially.
- **Without this:** On mobile, the page would look like a tiny desktop version.

```html
<title>The Backend — Image Sharing App</title>
```

- **What:** The text shown in the browser tab.

```html
<meta name="description" content="A full-stack image sharing app..." />
```

- **What:** A summary of the page for search engines (Google, Bing). When your page appears in search results, this becomes the description text.

```html
<div id="root"></div>
```

- **What:** An empty `<div>` that React will take over and fill with the entire UI.
- **How?** In `main.jsx`: `createRoot(document.getElementById("root"))` finds this div and tells React to render inside it.
- **Before React loads:** This div is completely empty (blank white page).
- **After React loads:** This div contains the entire app (navigation, forms, feed, etc.).

```html
<script type="module" src="/src/main.jsx"></script>
```

- **What:** Loads the React entry point file.
- **`type="module"`** — Tells the browser this is an ES Module (supports `import`/`export` statements).
- **In development:** Vite intercepts this, compiles JSX to JavaScript on-the-fly, and serves it to the browser.
- **In production:** Vite bundles everything into an optimized file during `npm run build`.

---

### 2. `vite.config.js` — Vite Configuration

```js
import { defineConfig } from "vite";
```

- **What:** Imports `defineConfig` — a helper that provides autocomplete suggestions in your code editor for config options.
- **`import { ... } from "..."`** — This is ES Module import syntax (different from `require()` in CommonJS). Frontend projects use this style.

```js
import react from "@vitejs/plugin-react";
```

- **What:** The Vite plugin that teaches Vite how to handle React.
- **Without this plugin:** Vite wouldn't know how to compile JSX. `<div className="card">` would cause an error.
- **What it enables:**
    1. JSX compilation (converts JSX to `React.createElement()` calls)
    2. Fast Refresh (when you save a file, only the changed component re-renders — the page doesn't fully reload)

```js
import tailwindcss from "@tailwindcss/vite";
```

- **What:** The plugin that processes Tailwind CSS utility classes.

```js
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
```

- **`export default`** — Makes this the main export of the file. Vite reads this config when it starts.
- **`plugins: [...]`** — An array of Vite plugins to activate.

---

### 3. `src/main.jsx` — React Entry Point

This is the FIRST JavaScript code that runs. It connects React to the HTML page.

```js
import { StrictMode } from "react";
```

- **What:** `StrictMode` is a React development helper. It wraps your app and:
    1. Runs components twice during development to detect "side effects" (unexpected behaviors)
    2. Warns about deprecated (outdated) React APIs
    3. Does NOTHING in production builds — it's a development-only tool

```js
import { createRoot } from "react-dom/client";
```

- **What:** The function that connects React to the browser's DOM (Document Object Model).
- **DOM** — The browser's internal representation of the HTML page as a tree of objects. `document.getElementById("root")` accesses this tree.
- **`react-dom/client`** — The `/client` part means we want the client-side (browser) version. React can also render on the server (SSR).

```js
import "./index.css";
```

- **What:** Imports the global CSS file. By importing it at the top level, these styles apply everywhere.
- **How does importing CSS work?** Vite sees the `.css` file, processes it, and injects the styles into the page's `<head>` as a `<style>` tag.

```js
import App from "./App.jsx";
```

- **What:** Imports the main `App` component — the top of the component tree.

```js
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
```

- **Step by step:**
    1. `document.getElementById("root")` — Find the `<div id="root">` in `index.html`
    2. `createRoot(...)` — Create a React rendering root inside that div
    3. `.render(...)` — Tell React WHAT to display: `<StrictMode>` wrapping `<App />`
    4. React takes over the empty div and fills it with the app's UI!
- **`<App />`** — JSX syntax for rendering a component. The `/` means it's a self-closing tag (no children).

---

### 4. `src/App.jsx` — Main Component (Router)

This component decides which PAGE to show based on the current URL.

```js
import React from "react";
```

- **What:** Imports the React library. Required for JSX to work.
- **Why?** When Vite compiles `<div>`, it converts it to `React.createElement("div")`. This needs `React` to be in scope.

```js
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
```

- **What:** Imports the two page components. These are the "screens" of the app.

```js
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
```

- **What:** Imports four things from React Router:
    - **`BrowserRouter`** — The main router component. Wraps your entire app to enable navigation. Uses the browser's History API to change URLs without page reloads.
    - **`as Router`** — An alias (nickname). We call it `Router` instead of `BrowserRouter` for shorter code.
    - **`Routes`** — A container that holds all `<Route>` definitions. It looks at the current URL and renders ONLY the matching route.
    - **`Route`** — Maps a URL path to a component. "When the URL is X, show component Y."
    - **`Navigate`** — A component that automatically redirects to another URL.

```js
const App = () => {
```

- **What:** A functional component. It's a function that returns JSX.
- **`const App = () => { ... }`** — Arrow function syntax.
- **Why capital `A`?** React convention: component names must start with a capital letter. React uses this to distinguish between HTML elements (`<div>`) and components (`<App />`).

```js
    return (
        <Router>
```

- **`<Router>`** — Wraps everything to enable routing. Must be at the top level of the component tree.

```js
            <Routes>
```

- **`<Routes>`** — Contains all the route definitions.

```js
<Route path="/" element={<Navigate to="/feed" replace />} />
```

- **`path="/"`** — When the URL is exactly `/` (the root, like `http://localhost:5173/`).
- **`element={<Navigate to="/feed" replace />}`** — Instead of showing a component, redirect to `/feed`.
- **`replace`** — Replace the current history entry instead of adding a new one. Without `replace`, pressing the Back button would go to `/`, which would redirect to `/feed` again — creating an infinite redirect loop.

```js
<Route path="/create-post" element={<CreatePost />} />
```

- **What:** When the URL is `/create-post`, render the `CreatePost` component.

```js
<Route path="/feed" element={<Feed />} />
```

- **What:** When the URL is `/feed`, render the `Feed` component.

**URL → Component mapping:**

| URL            | What shows up         |
| -------------- | --------------------- |
| `/`            | Redirects to `/feed`  |
| `/feed`        | Feed page (all posts) |
| `/create-post` | Create post form      |

```js
export default App;
```

- **What:** Exports the `App` component so `main.jsx` can import and render it.
- **`export default`** — Makes `App` the default export. When another file does `import App from "./App"`, it gets this component.

---

### 5. `src/config/api.js` — API Helper Functions

Instead of writing `axios.get("http://localhost:3000/api/post")` in every component, we create a pre-configured instance with simple helper functions.

```js
import axios from "axios";
```

- **What:** Imports the Axios HTTP library.
- **Axios vs fetch():** Both make HTTP requests. Axios advantages:
    - Automatically parses JSON responses (no `.json()` call needed)
    - Better error handling (non-2xx responses are treated as errors)
    - Works the same in the browser and Node.js

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});
```

- **`axios.create({...})`** — Creates a new Axios instance with custom configuration. All requests made with this instance will use these settings.
- **`baseURL`** — A base URL prepended to every request. So `api.get("/post")` actually calls `http://localhost:3000/api/post`.
- **`import.meta.env.VITE_API_URL`** — Reads the environment variable. In Vite, `import.meta.env` contains your env vars (instead of `process.env`).
- **`|| "http://localhost:3000/api"`** — Fallback if the env var isn't set.

```js
export async function apiGet(url) {
    const response = await api.get(url);
    return response;
}
```

- **What:** A simple helper function that makes a GET request.
- **`export`** — Makes this function importable by other files. Other files can do `import { apiGet } from "../config/api"`.
- **`async function`** — The function is asynchronous (it uses `await` inside).
- **`await api.get(url)`** — `await` pauses execution until the API responds. Without `await`, `response` would be a Promise object instead of the actual data.
- **`return response`** — Returns the full response. The calling code can access `response.data` to get the JSON body.
- **How it's used:** `const res = await apiGet("/post")` → makes a GET request to `http://localhost:3000/api/post`

```js
export async function apiPost(url, data) {
    const response = await api.post(url, data);
    return response;
}
```

- **What:** Same idea but for POST requests (sending data to the server).
- **`data`** — The data to send in the request body (can be JSON, FormData, etc.).
- **How it's used:** `await apiPost("/create-post", formData)` → sends the form data to the backend

```js
export default api;
```

- **What:** Also exports the raw `api` instance as the default export, in case you need it directly.
- **Named vs Default exports:** A file can have ONE default export and MANY named exports.
    - `import api from "../config/api"` → gets the default (the raw axios instance)
    - `import { apiGet, apiPost } from "../config/api"` → gets the named exports (helpers)

---

### 6. `src/pages/CreatePost.jsx` — Create Post Form

This component renders a form where users can upload an image and write a caption.

```js
import React from "react";
import { useState } from "react";
```

- **`useState`** — A React **Hook** for managing state (data that changes over time).
- **What is State?** Data that, when changed, causes React to re-render the component (update the screen). It's like a "watched variable."
- **What is a Hook?** A special function that lets you "hook into" React features from functional components. Rules: (1) Only call at the top level of a component, (2) Never inside loops, conditions, or nested functions, (3) Hook names start with `use`.

```js
import { useNavigate } from "react-router-dom";
```

- **`useNavigate`** — A React Router hook that gives you a function to navigate programmatically. Instead of the user clicking a link, your code can redirect them.

```js
import { apiPost } from "../config/api";
```

- **What:** Our simple helper function to send POST requests.

```js
const CreatePost = () => {
```

- **What:** The component function.

```js
const [loading, setLoading] = useState(false);
```

- **`useState(false)`** — Creates a state variable with an initial value of `false`.
- **Returns an array with two items:**
    1. `loading` — The current value of the state (starts as `false`)
    2. `setLoading` — A function to UPDATE the value
- **Why not just `let loading = false`?** Regular variables don't trigger re-renders. When you call `setLoading(true)`, React knows the state changed and re-renders the component to show the updated UI (like disabling the button).

```js
const navigate = useNavigate();
```

- **What:** Gets the navigation function. Calling `navigate("/feed")` redirects to the feed page.

```js
    const handleSubmit = async (e) => {
```

- **What:** The function that runs when the form is submitted.
- **`async`** — We need `await` inside (for the API call).
- **`e`** — The form submission event object. Contains info about the event and methods to control it.

```js
e.preventDefault();
```

- **What:** Stops the browser's default form submission behavior.
- **Default behavior:** When an HTML form is submitted, the browser reloads the entire page and sends the data to the server. In React, we handle submission ourselves with JavaScript — we DON'T want a page reload (it would destroy our React app's state).

```js
const formData = new FormData(e.target);
```

- **What:** Creates a `FormData` object from the form.
- **`FormData`** — A built-in browser API that collects all input values from a form element into a format suitable for sending to a server.
- **`e.target`** — The HTML `<form>` element that was submitted.
- **Why FormData?** For file uploads, you need to send data as `multipart/form-data` format. FormData handles this automatically.

```js
setLoading(true);
await apiPost("/create-post", formData);
setLoading(false);
navigate("/feed");
```

- **Step by step:**
    1. `setLoading(true)` — Show the loading state (disables button, shows "Posting..." text)
    2. `await apiPost(...)` — Send the form data to the backend. `await` pauses here until the server responds.
    3. `setLoading(false)` — Re-enable the button
    4. `navigate("/feed")` — Redirect the user to the feed page

```js
    return (
        <section className="create-post-container">
```

- **`return (...)`** — Returns JSX (what the component renders on screen).
- **`className`** — In JSX, you use `className` instead of HTML's `class` because `class` is a reserved keyword in JavaScript.

```js
                <form className="post-form" onSubmit={handleSubmit}>
```

- **`onSubmit={handleSubmit}`** — When the form is submitted, run the `handleSubmit` function.
- **Submission triggers:** Clicking a `type="submit"` button, or pressing Enter in a text field.

```js
<input type="file" name="image" accept="image/*" className="input-field" />
```

- **`type="file"`** — Renders a file picker button.
- **`name="image"`** — The field name. MUST match what the backend expects: `upload.single("image")`.
- **`accept="image/*"`** — Only show image files in the file picker dialog. `*` means any subtype (jpeg, png, gif, etc.).

```js
<input
    type="text"
    name="caption"
    placeholder="What's on your mind?"
    required
    className="input-field"
/>
```

- **`placeholder="..."`** — Gray text shown when the input is empty, giving the user a hint.
- **`required`** — HTML5 validation. Prevents the form from submitting if this field is empty.

```js
<button
    type="submit"
    className={`submit-btn ${loading ? "disabled" : ""}`}
    disabled={loading}>
    {loading ? "Posting..." : "Post to Feed"}
</button>
```

- **`type="submit"`** — Clicking this button submits the parent form.
- **``className={`submit-btn ${...}`}``** — Template literal in JSX. Combines "submit-btn" with conditional "disabled" class.
- **`loading ? "disabled" : ""`** — Ternary operator: if loading is true, add "disabled" class; otherwise add nothing.
- **`disabled={loading}`** — When `loading` is true, the button is disabled (can't be clicked). Prevents double-submissions.
- **`{loading ? "Posting..." : "Post to Feed"}`** — Changes button text based on loading state.

```js
export default CreatePost;
```

- **What:** Exports the component so `App.jsx` can import and use it.

**The complete flow:**

1. User fills in the form (picks an image + writes a caption)
2. User clicks "Post to Feed"
3. `handleSubmit` runs → collects form data → sends it via `apiPost()`
4. While sending → button shows "Posting..." and is disabled
5. After server responds → redirects to `/feed`

---

### 7. `src/pages/Feed.jsx` — Feed Page

This component fetches and displays all posts from the backend API.

```js
import { useState, useEffect } from "react";
```

- **`useEffect`** — A Hook for performing "side effects" — anything outside of rendering:
    - Fetching data from an API ← what we use it for
    - Setting up timers
    - Subscribing to events
    - Directly modifying the DOM

```js
import { apiGet } from "../config/api";
```

- **What:** Our simple helper function to send GET requests.

```js
const [posts, setPosts] = useState([]);
```

- **What:** State to hold the array of post objects. Starts as an empty array `[]`.
- **After fetch:** `[{ _id: "...", image: "...", caption: "...", createdAt: "..." }, ...]`

```js
const [loading, setLoading] = useState(true);
```

- **What:** Loading state. Starts as `true` because we fetch data immediately when the page loads.

```js
useEffect(() => {
    const fetchPosts = async () => {
        const res = await apiGet("/post");
        setPosts(res.data.posts);
        setLoading(false);
    };

    fetchPosts();
}, []);
```

- **How useEffect works:** `useEffect(callback, dependencies)`
    - **`callback`** — The function to run.
    - **`dependencies`** — When to run it:
        - **`[]` (empty array)** — Run ONCE when the component first mounts. ← We use this
        - **`[value]`** — Run every time `value` changes.
        - **No array at all** — Run after every single render (usually a mistake — causes infinite loops!).
- **Why define function inside?** You can't make useEffect's callback directly `async`. So you define a separate `async` function inside and call it immediately.
- **`await apiGet("/post")`** — Sends GET to `http://localhost:3000/api/post`.
- **`res.data`** — Axios puts the response body in `.data`. Our backend sends: `{ success: true, posts: [...], count: N }`.
- **`res.data.posts`** — The array of post objects.
- **`setPosts(res.data.posts)`** — Updates the state. React re-renders the component with the new posts data.
- **`setLoading(false)`** — Hides the spinner and shows the actual content.

```js
if (loading) {
    return (
        <section className="feed-section">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading posts...</p>
            </div>
        </section>
    );
}
```

- **What:** "Early return" pattern. If we're still loading, return the loading UI and stop. The rest of the component doesn't render.
- **CSS handles the animation:** The `.loading-spinner` class uses `@keyframes spin` CSS animation.

```js
{
    posts.length > 0 ? (
        posts.map((post) => (
            <div key={post._id} className="post-card">
                <img src={post.image} alt={post.caption} />
                <p>{post.caption}</p>
            </div>
        ))
    ) : (
        <div className="empty-state">
            <h2>No posts yet!</h2>
            <p>Be the first to create a post.</p>
        </div>
    );
}
```

- **Ternary operator** `condition ? valueIfTrue : valueIfFalse` — JSX way to do if/else.
- **`.map((post) => (...))`** — Loops through the posts array and returns JSX for each item. `.map()` is how you render lists in React.
- **`key={post._id}`** — React requires a unique `key` for each item in a list. React uses keys to efficiently track which items changed, were added, or removed. Without keys, React re-renders the entire list even if only one item changed. MongoDB's `_id` is perfect because it's always unique.
- **`<img src={post.image} ... />`** — Displays the image from the ImageKit CDN URL.
- **`alt={post.caption}`** — Alternative text shown if the image fails to load, and read by screen readers for accessibility.

```js
export default Feed;
```

- **What:** Exports the component so `App.jsx` can import and use it.

**The complete flow:**

1. Page loads → `useEffect` runs → calls `apiGet("/post")`
2. While loading → shows a spinning animation
3. Once data arrives → updates `posts` state → React re-renders
4. If posts exist → shows cards with image + caption
5. If no posts exist → shows "No posts yet!" message

---

### 8. `src/index.css` — Global Styles

This file contains ALL the CSS for the entire app. Every class used in JSX is defined here.

```css
@import "tailwindcss";
```

- **What:** Imports Tailwind CSS base styles and utilities.

---

#### Global / Reset Styles

```css
* {
    box-sizing: border-box;
}
```

- **`*`** — Universal selector (applies to ALL elements).
- **`box-sizing: border-box`** — Padding and borders are INCLUDED in the element's width/height. Without this, a `width: 100px` element with `padding: 20px` would actually be `140px` wide. With `border-box`, it stays `100px`.

```css
html,
body,
#root {
    height: 100%;
    width: 100%;
}
```

- **What:** Makes the document fill the entire browser window. Without this, the page height would only be as tall as the content, preventing vertical centering.

```css
body {
    margin: 0;
    font-family:
        "Inter",
        system-ui,
        -apple-system,
        sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #333;
}
```

- **`margin: 0`** — Removes the default body margin (browsers add ~8px margin by default).
- **`font-family`** — A font stack. The browser tries each font in order:
    1. `"Inter"` — A modern, clean font (if the user has it installed or loaded)
    2. `system-ui` — The operating system's default UI font
    3. `-apple-system` — Apple's San Francisco font (macOS/iOS)
    4. `sans-serif` — Final fallback
- **`linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`** — A smooth diagonal gradient from light gray to light blue.
    - `135deg` — Diagonal direction (top-left to bottom-right)
    - `#f5f7fa` — Light gray (at position 0%, the start)
    - `#c3cfe2` — Light blue (at position 100%, the end)

---

#### CreatePost Page Styles

```css
.create-post-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
```

- **`min-height: 100vh`** — At least 100% of the viewport height (the full screen).
- **Flexbox centering pattern** — The most common CSS pattern to center content:
    - `display: flex` — Turns the container into a flex container
    - `align-items: center` — Centers children vertically
    - `justify-content: center` — Centers children horizontally

```css
.form-card {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

- **`max-width: 400px`** — Card won't grow wider than 400px, but can shrink on small screens.
- **`border-radius: 20px`** — Rounded corners.
- **`box-shadow: X Y blur color`** — Adds a shadow to the element.
    - `0` — X offset (0 = centered horizontally)
    - `10px` — Y offset (10px below the element)
    - `25px` — Blur radius (higher = softer shadow)
    - `rgba(0, 0, 0, 0.1)` — Black color at 10% opacity (very subtle)

```css
.form-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
}
```

- **`rem`** — A relative unit. `1rem` = the root element's font size (usually 16px). So `1.5rem` = 24px.

```css
.form-group {
    margin-bottom: 1.2rem;
}
```

- **What:** Adds spacing between form fields.

```css
.form-label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #555;
}
```

- **`display: block`** — Makes the label take the full width (each label on its own line).
- **`font-weight: 600`** — Semi-bold text (400 is normal, 700 is bold).

```css
.input-field {
    width: 100%;
    padding: 12px;
    border: 2px solid #eee;
    border-radius: 10px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}
```

- **`transition: all 0.3s ease`** — Smoothly animates any property change over 0.3 seconds. When the border color changes on focus, it fades instead of snapping.

```css
.input-field:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}
```

- **`:focus`** — A pseudo-class that applies when the user clicks on or tabs to the input.
- **`outline: none`** — Removes the browser's default blue/orange outline.
- **`box-shadow: 0 0 0 4px rgba(...)`** — Creates a colored "ring" around the input. Using `box-shadow` instead of `border` avoids layout shifts.

```css
.submit-btn {
    width: 100%;
    background: #4a90e2;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition:
        transform 0.2s,
        background 0.3s;
}
```

- **`cursor: pointer`** — Shows the hand cursor on hover (indicates the element is clickable).
- **`transition`** — Smoothly animates transform (scale) and background color changes.

```css
.submit-btn:hover {
    background: #357abd;
}
```

- **`:hover`** — Applies when the mouse is over the button. Darkens the blue.

```css
.submit-btn:active {
    transform: scale(0.98);
}
```

- **`:active`** — Applies while the button is being clicked/pressed. Shrinks it slightly for a "press" effect.

```css
.submit-btn.disabled,
.submit-btn:disabled {
    background: #a0c4e8;
    cursor: not-allowed;
    transform: none;
    opacity: 0.7;
}
```

- **What:** Grayed-out style when the button is disabled (while submitting).
- **`.submit-btn.disabled`** — When both classes are on the same element.
- **`:disabled`** — When the HTML `disabled` attribute is set.

---

#### Feed Page Styles

```css
.feed-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    gap: 30px;
}
```

- **`flex-direction: column`** — Stack children vertically (default is horizontal/row).
- **`gap: 30px`** — Space between each child element. A modern alternative to adding margin to each card.

```css
.post-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}
```

- **`overflow: hidden`** — Clips any content that extends beyond the card's boundaries. Without this, the image would stick out past the card's rounded corners.

```css
.post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
```

- **`translateY(-2px)`** — Moves the card 2px UP on hover, creating a "lift" effect.
- **Bigger shadow on hover** — Combined with the lift, creates a 3D "floating" effect.

```css
.post-card img {
    width: 100%;
    height: auto;
    display: block;
}
```

- **`width: 100%`** — Image fills the card width.
- **`height: auto`** — Maintains aspect ratio.
- **`display: block`** — Removes the tiny gap that appears below inline images.

```css
.post-card p {
    padding: 15px 20px;
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: #444;
}
```

- **`line-height: 1.5`** — Space between lines of text. `1.5` means 1.5× the font size.

```css
.empty-state {
    text-align: center;
    color: #888;
    margin-top: 50px;
}
```

- **What:** Centered text shown when no posts exist yet.

---

#### Loading Spinner Styles

```css
.loading-container {
    text-align: center;
    margin-top: 80px;
}
```

- **What:** Centers the spinner and push it down from the top.

```css
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #4a90e2;
    border-radius: 50%;
    margin: 0 auto 16px;
    animation: spin 0.8s linear infinite;
}
```

- **How the spinner works:**
    - It's a `40×40px` circle (`border-radius: 50%` makes it round).
    - All 4 borders are light gray (`#e5e7eb`).
    - The TOP border is overridden to blue (`#4a90e2`) — this creates the "partial circle" look.
    - `animation: spin 0.8s linear infinite` — Rotates it continuously.
        - `spin` — Name of the keyframes animation (defined below).
        - `0.8s` — One full rotation takes 0.8 seconds.
        - `linear` — Constant speed (no easing).
        - `infinite` — Never stops.

```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
```

- **`@keyframes`** — Defines a CSS animation.
- **`from` → `to`** — Start state and end state. Rotates from 0° to 360° (one full turn).

```css
.loading-text {
    color: #888;
    font-size: 1rem;
}
```

- **What:** Gray text saying "Loading posts..." below the spinner.

---

## How the App Works (The Big Picture)

```
User opens http://localhost:5173/
        │
        ▼
   index.html loads
        │
        ▼
   main.jsx runs
        │
        ▼
   <App /> renders
        │
        ▼
   Router checks URL
        │
    ┌───┴───────────────┐
    │                   │
 URL is /feed     URL is /create-post
    │                   │
    ▼                   ▼
 <Feed />         <CreatePost />
    │                   │
    ▼                   ▼
 apiGet("/post")   User fills form
    │                   │
    ▼                   ▼
 Shows posts       apiPost("/create-post", data)
                        │
                        ▼
                   Redirects to /feed
```

---

## npm Scripts

| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Starts the dev server with hot reload   |
| `npm run build`   | Builds for production (creates `dist/`) |
| `npm run preview` | Preview the production build locally    |
| `npm run lint`    | Check code for errors and style issues  |
