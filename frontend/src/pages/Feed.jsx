// Feed.jsx — Displays all posts from the API in a card layout

import React from "react";
import { useState, useEffect } from "react"; // useState for state, useEffect to fetch on load
import api from "../config/api"; // Centralized Axios instance

const Feed = () => {
    const [posts, setPosts] = useState([]); // Array of post objects from DB
    const [loading, setLoading] = useState(true); // True while fetching data
    const [error, setError] = useState(""); // Error message string

    // Fetch posts when component first mounts (empty [] = run once)
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/post"); // GET /api/post
                setPosts(res.data.posts); // Update state with posts array
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Failed to load posts. Please try again later.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Show loading spinner while fetching
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

    // Show error with retry button if fetch failed
    if (error) {
        return (
            <section className="feed-section">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="submit-btn"
                        onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="feed-section">
            {posts.length > 0 ? (
                // Map each post to a card — key must be unique (MongoDB _id)
                posts.map((post) => (
                    <div key={post._id} className="post-card">
                        <img src={post.image} alt={post.caption} />
                        <p>{post.caption}</p>
                    </div>
                ))
            ) : (
                // Empty state when no posts exist yet
                <div className="empty-state">
                    <h2>No posts yet!</h2>
                    <p>Be the first to create a post.</p>
                </div>
            )}
        </section>
    );
};

export default Feed;
