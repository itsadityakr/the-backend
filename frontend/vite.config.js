// vite.config.js — Vite build tool config: enables React and Tailwind CSS

import { defineConfig } from "vite"; // Provides config autocomplete
import react from "@vitejs/plugin-react"; // Enables JSX compilation + Fast Refresh
import tailwindcss from "@tailwindcss/vite"; // Processes Tailwind CSS utility classes

export default defineConfig({
    plugins: [react(), tailwindcss()],
});
