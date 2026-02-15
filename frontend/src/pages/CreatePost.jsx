// CreatePost.jsx — Form page for uploading an image with a caption

import React from "react";
import { useState } from "react"; // Hook for managing loading state
import { useNavigate } from "react-router-dom"; // Hook to redirect after post creation
import { apiPost } from "../config/api"; // Simple helper to send POST requests

const CreatePost = () => {
    const [loading, setLoading] = useState(false); // True while form is submitting
    const navigate = useNavigate(); // Function to redirect to another page

    // Runs when user clicks "Post to Feed"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        const formData = new FormData(e.target); // Collects all form field values

        setLoading(true);
        await apiPost("/create-post", formData); // Send to backend API
        setLoading(false);
        navigate("/feed"); // Redirect to feed on success
    };

    return (
        <section className="create-post-container">
            <div className="form-card">
                <h1 className="form-title">Create Post</h1>

                <form className="post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Upload Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Caption</label>
                        <input
                            type="text"
                            name="caption"
                            placeholder="What's on your mind?"
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Disable button while uploading to prevent double-clicks */}
                    <button
                        type="submit"
                        className={`submit-btn ${loading ? "disabled" : ""}`}
                        disabled={loading}>
                        {loading ? "Posting..." : "Post to Feed"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CreatePost;
