// api.js — Simple helper functions for making API calls

import axios from "axios"; // HTTP request library

// Create an Axios instance with the backend URL already set
// This way, we don't have to type the full URL every time
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// ---- Simple Helper Functions ----

/**
 * Makes a GET request to the given URL path.
 * Example: const data = await apiGet("/post")  →  GET http://localhost:3000/api/post
 */
export async function apiGet(url) {
    const response = await api.get(url);
    return response;
}

/**
 * Makes a POST request to the given URL path with some data.
 * Example: await apiPost("/create-post", formData)  →  POST http://localhost:3000/api/create-post
 */
export async function apiPost(url, data) {
    const response = await api.post(url, data);
    return response;
}

export default api;
