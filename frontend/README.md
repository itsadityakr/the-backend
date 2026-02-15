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
    │   └── api.js            ← Centralized HTTP client (Axios) setup
    │
    └── pages/                ← Page components (one per URL/route)
        ├── CreatePost.jsx    ← Form for creating new posts
        └── Feed.jsx          ← Displays all posts from the API
```

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

## ️ Environment Variables

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

- **What:** Sets the character encoding to UTF-8 (supports all languages, symbols, and emoji ).

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

```js
export default App;
```

- **What:** Exports the `App` component so `main.jsx` can import and render it.
- **`export default`** — Makes `App` the default export. When another file does `import App from "./App"`, it gets this component.

---

### 5. `src/config/api.js` — Centralized HTTP Client

Instead of writing `axios.get("http://localhost:3000/api/post")` in every component, we create a pre-configured instance.

```js
import axios from "axios";
```

- **What:** Imports the Axios HTTP library.
- **Axios vs fetch():** Both make HTTP requests. Axios advantages:
    - Automatically parses JSON responses (no `.json()` call needed)
    - Better error handling (non-2xx responses are treated as errors)
    - Supports interceptors (functions that run on every request/response)
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
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            "API Error:",
            error.response?.data?.message || error.message,
        );
        return Promise.reject(error);
    },
);
```

- **What:** An interceptor — a function that runs on every API response.
- **First function `(response) => response`** — For successful responses, just pass them through unchanged.
- **Second function `(error) => { ... }`** — For errors, log the error message and then re-throw it so the calling component can handle it too.
- **`error.response?.data?.message`** — Tries to get the error message from the backend's JSON response. The `?.` (optional chaining) prevents crashes if `response` or `data` is undefined.
- **`Promise.reject(error)`** — Re-throws the error so the component's `catch` block still catches it.

```js
export default api;
```

- **What:** Exports the configured instance so all components use the same settings.

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
import api from "../config/api";
```

- **What:** Our pre-configured Axios instance.

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
const [error, setError] = useState("");
```

- **What:** Error message state. Empty string means no error.

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
setError("");
```

- **What:** Clears any previous error message.

```js
const formData = new FormData(e.target);
```

- **What:** Creates a `FormData` object from the form.
- **`FormData`** — A built-in browser API that collects all input values from a form element into a format suitable for sending to a server.
- **`e.target`** — The HTML `<form>` element that was submitted.
- **Why FormData?** For file uploads, you need to send data as `multipart/form-data` format. FormData handles this automatically.

```js
        const imageFile = formData.get("image");
        if (!imageFile || imageFile.size === 0) {
```

- **`formData.get("image")`** — Gets the value of the form field named "image" (the file input).
- **`imageFile.size === 0`** — If no file was selected, the size is 0.
- **Why validate here (client-side)?** To give instant feedback without waiting for a server round-trip. The server also validates (defense in depth).

```js
        const caption = formData.get("caption");
        if (!caption || !caption.trim()) {
```

- **What:** Gets and validates the caption text. Rejects empty or whitespace-only captions.

```js
        try {
            setLoading(true);
```

- **What:** Shows the loading state (disables button, shows "Posting..." text).

```js
await api.post("/create-post", formData);
```

- **`api.post(url, data)`** — Sends an HTTP POST request.
- **`"/create-post"`** — The endpoint path. Combined with the base URL: `http://localhost:3000/api/create-post`.
- **`formData`** — The form data (image file + caption). Axios automatically sets the `Content-Type` header to `multipart/form-data` when you pass a FormData object.

```js
navigate("/feed");
```

- **What:** After successful post creation, redirect the user to the feed page.

```js
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
```

- **`err.response?.data?.message`** — Try to get the error message from the backend's response.
- **`?.`** (Optional chaining) — If `err.response` is undefined, return `undefined` instead of throwing a "Cannot read property of undefined" error.
    - Without `?.`: `err.response.data.message` → crashes if `err.response` is undefined!
    - With `?.`: `err.response?.data?.message` → returns `undefined` safely
- **`||`** — If the backend message is undefined, use the fallback message.

```js
        } finally {
            setLoading(false);
        }
```

- **`finally`** — Runs regardless of whether `try` succeeded or `catch` caught an error.
- **Why here?** We ALWAYS want to re-enable the button:
    - If success: user navigates away (but good practice)
    - If error: user needs the button enabled to try again

```js
    return (
        <section className="create-post-container">
```

- **`return (...)`** — Returns JSX (what the component renders on screen).
- **`className`** — In JSX, you use `className` instead of HTML's `class` because `class` is a reserved keyword in JavaScript.

```js
{
    error && <p className="error-message">{error}</p>;
}
```

- **What:** Conditional rendering using the `&&` (AND) operator.
- **How it works:** If `error` is truthy (not empty string), render the `<p>`. If falsy (empty string), render nothing.
- **Pattern:** `{condition && <element>}` — show element only when condition is true.

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
        const fetchPosts = async () => { ... };
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

```js
const res = await api.get("/post");
setPosts(res.data.posts);
```

- **`api.get("/post")`** — Sends GET to `http://localhost:3000/api/post`.
- **`res.data`** — Axios puts the response body in `.data`. Our backend sends: `{ success: true, posts: [...], count: N }`.
- **`res.data.posts`** — The array of post objects.
- **`setPosts(res.data.posts)`** — Updates the state. React re-renders the component with the new posts data.

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
    if (error) {
        return (
            ...
            <button className="submit-btn" onClick={() => window.location.reload()}>
                Try Again
            </button>
```

- **What:** Error state with a retry button.
- **`window.location.reload()`** — Reloads the entire page (a simple way to retry the data fetch).

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

---

### 8. `src/index.css` — Global Styles

```css
@import "tailwindcss";
```

- **What:** Imports Tailwind CSS base styles and utilities.

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
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

- **`linear-gradient(angle, color1, color2)`** — Creates a smooth transition between colors.
    - `135deg` — Diagonal direction (top-left to bottom-right)
    - `#f5f7fa` — Light gray (at position 0%, the start)
    - `#c3cfe2` — Light blue (at position 100%, the end)

```css
.create-post-container {
    display: flex;
    align-items: center;
    justify-content: center;
```

- **Flexbox centering pattern** — The most common CSS pattern to center content:
    - `display: flex` — Turns the container into a flex container
    - `align-items: center` — Centers children vertically
    - `justify-content: center` — Centers children horizontally

```css
.form-card {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
```

- **`box-shadow: X Y blur color`** — Adds a shadow to the element.
    - `0` — X offset (0 = centered horizontally)
    - `10px` — Y offset (10px below the element)
    - `25px` — Blur radius (higher = softer shadow)
    - `rgba(0, 0, 0, 0.1)` — Black color at 10% opacity (very subtle)

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
    transition:
        transform 0.2s,
        background 0.3s;
}
```

- **`transition`** — Smoothly animates changes to the specified properties. When the background color changes (on hover), it transitions over 0.3 seconds instead of instantly snapping.

```css
.post-card {
    overflow: hidden;
}
```

- **What:** Clips any content that extends beyond the card's boundaries.
- **Why?** Without this, the image would stick out past the card's rounded corners.

```css
.post-card:hover {
    transform: translateY(-2px);
}
```

- **What:** When the user hovers over a post card, it moves up by 2 pixels, creating a "lift" effect.

```css
.loading-spinner {
    border: 4px solid #e5e7eb;
    border-top: 4px solid #4a90e2;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
```

- **How the spinner works:**
    1. A circle is created with `border-radius: 50%`
    2. The border is light gray on all sides
    3. The TOP border is overridden to blue
    4. CSS animation rotates it 360 degrees continuously
    5. Result: a circle with one blue section spinning around!

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

- **`@keyframes`** — Defines an animation sequence.
- **`from`** — Starting state (0° rotation).
- **`to`** — Ending state (360° rotation = full circle).
- **`linear`** — Constant speed throughout (no acceleration/deceleration).
- **`infinite`** — Repeat forever.

---

## Data Flow Diagrams

### Creating a Post

```
User fills form → clicks "Post to Feed"
       │
       ▼
handleSubmit(e) runs
       │
       ├─ e.preventDefault() — stop page reload
       ├─ setError("") — clear old errors
       ├─ new FormData(e.target) — collect form values
       │
       ├─ Validate: image file exists?
       │      NO → setError("Please select an image") → STOP
       │
       ├─ Validate: caption not empty?
       │      NO → setError("Please enter a caption") → STOP
       │
       ├─ setLoading(true) — disable button, show "Posting..."
       │
       ├─ api.post("/create-post", formData) — send to backend
       │
       ├─ SUCCESS → navigate("/feed") → user sees their post!
       │
       └─ ERROR → setError(error message) → red error box appears
       │
       └─ FINALLY → setLoading(false) — re-enable button
```

### Loading the Feed

```
Component mounts (page loads)
       │
       ▼
useEffect runs (only once, because of [])
       │
       ├─ setLoading(true) → spinner appears
       ├─ setError("") → clear old errors
       │
       ├─ api.get("/post") → fetch from backend
       │
       ├─ SUCCESS → setPosts(data) → posts appear as cards
       │
       ├─ ERROR → setError(message) → error + retry button shown
       │
       └─ FINALLY → setLoading(false) → spinner disappears
```

---

## Key Concepts for Beginners

### What is React?

React is a JavaScript library for building user interfaces. Instead of manipulating HTML directly with `document.getElementById()` and `.innerHTML`, you describe what the UI should look like using components and JSX. React then efficiently updates the real DOM when data changes.

### What is JSX?

JSX is a syntax extension that lets you write HTML-like code inside JavaScript files. It looks like HTML but it's actually JavaScript. Vite/Babel compiles `<div className="card">Hello</div>` into `React.createElement("div", {className: "card"}, "Hello")`.

### What is a Component?

A reusable piece of UI defined as a function that returns JSX. Components can:

- Accept data via **props** (like function parameters)
- Manage their own **state** (changing data)
- Render other components (nesting)

### What is State?

Data owned by a component that can change over time. When state changes, React automatically re-renders the component. Created with `useState()`. Unlike regular variables, updating state triggers a UI update.

### What is a Hook?

A special function starting with `use` that lets you access React features:

- `useState` — Add state to a component
- `useEffect` — Run code when component loads or state changes
- `useNavigate` — Navigate to different pages programmatically

### What is the Virtual DOM?

React doesn't update the real DOM directly (that's slow). Instead, it maintains a "virtual" copy of the DOM in memory. When state changes, React:

1. Creates a new virtual DOM
2. Compares it with the previous virtual DOM (called "diffing")
3. Updates ONLY the changed parts of the real DOM

This makes React fast — it minimizes expensive DOM operations.

### What are Props?

Props (short for "properties") are how you pass data from a parent component to a child component. They're like function arguments — read-only and flow downward.

### What is `import` vs `require()`?

- **`import`** — ES Module syntax (modern JavaScript). Used in the frontend because Vite and browsers support it.
- **`require()`** — CommonJS syntax (traditional Node.js). Used in the backend.
- They do the same thing (load code from another file) but have different syntax.
