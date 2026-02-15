// Feed.jsx — Displays all posts from the API in a card layout

import React from "react";
import { useState, useEffect } from "react"; // useState for state, useEffect to fetch on load
import { apiGet } from "../config/api"; // Simple helper to send GET requests

const Feed = () => {
    const [posts, setPosts] = useState([]); // Array of post objects from DB
    const [loading, setLoading] = useState(true); // True while fetching data

    // Fetch posts when component first mounts (empty [] = run once)
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await apiGet("/post"); // GET /api/post
            setPosts(res.data.posts); // Update state with posts array
            setLoading(false);
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
