// CreatePost.jsx — Form page for uploading an image with a caption

import React from "react";
import { useState } from "react"; // Hook for managing loading/error state
import { useNavigate } from "react-router-dom"; // Hook to redirect after post creation
import api from "../config/api"; // Centralized Axios instance

const CreatePost = () => {
    const [loading, setLoading] = useState(false); // True while form is submitting
    const [error, setError] = useState(""); // Error message string (empty = no error)
    const navigate = useNavigate(); // Function to redirect to another page

    // Runs when user clicks "Post to Feed"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        setError("");

        const formData = new FormData(e.target); // Collects all form field values

        // Client-side validation
        const imageFile = formData.get("image");
        if (!imageFile || imageFile.size === 0) {
            setError("Please select an image to upload.");
            return;
        }

        const caption = formData.get("caption");
        if (!caption || !caption.trim()) {
            setError("Please enter a caption for your post.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/create-post", formData); // Send to backend API
            navigate("/feed"); // Redirect to feed on success
        } catch (err) {
            // Show backend error message, or fallback generic message
            setError(
                err.response?.data?.message ||
                    "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false); // Always re-enable the button
        }
    };

    return (
        <section className="create-post-container">
            <div className="form-card">
                <h1 className="form-title">Create Post</h1>

                {/* Show error message if there is one */}
                {error && <p className="error-message">{error}</p>}

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
