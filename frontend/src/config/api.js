// api.js — Centralized Axios instance with base URL and error logging

import axios from "axios"; // HTTP request library

// Create Axios instance with base URL from env (or default to localhost)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Log API errors automatically for debugging
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

export default api;
