// App.jsx — Main component that sets up page routing

import React from "react"; // Required for JSX
import CreatePost from "./pages/CreatePost"; // Create post form page
import Feed from "./pages/Feed"; // Posts feed display page

import {
    BrowserRouter as Router, // Enables navigation without page reloads
    Routes, // Container for all Route definitions
    Route, // Maps a URL path to a component
    Navigate, // Redirects from one URL to another
} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Redirect root "/" to "/feed" so users don't see a blank page */}
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/feed" element={<Feed />} />
            </Routes>
        </Router>
    );
};

export default App;
