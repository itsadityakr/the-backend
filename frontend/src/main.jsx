// main.jsx — React app entry point: mounts <App /> into the HTML page

import { StrictMode } from "react"; // Dev tool that warns about potential issues
import { createRoot } from "react-dom/client"; // Connects React to the browser DOM
import "./index.css"; // Global styles for the entire app
import App from "./App.jsx"; // Top-level component with all pages/routing

// Find div#root in index.html and render the React app inside it
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
