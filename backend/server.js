// server.js — Entry point: connects to DB, starts server, handles shutdown

const app = require("./src/app"); // Configured Express app
const { connectDB, mongoose } = require("./src/config/db"); // DB connection + mongoose instance
const { DEFAULT_PORT } = require("./src/config/constants");

const PORT = process.env.PORT || DEFAULT_PORT;

// Start the server after connecting to the database
async function startServer() {
    await connectDB(); // Exits process if DB connection fails

    const server = app.listen(PORT, () => {
        console.log(`\n Server is running on http://localhost:${PORT}`);
        console.log(` Health check: http://localhost:${PORT}/health`);
        console.log(` API endpoints:`);
        console.log(`   POST http://localhost:${PORT}/api/create-post`);
        console.log(`   GET  http://localhost:${PORT}/api/post\n`);
    });

    // Graceful shutdown — cleanly close server and DB connection
    const gracefulShutdown = (signal) => {
        console.log(`\n️  Received ${signal}. Starting graceful shutdown...`);
        server.close(async () => {
            console.log(" HTTP server closed");
            try {
                await mongoose.connection.close();
                console.log(" MongoDB connection closed");
            } catch (err) {
                console.error(" Error closing MongoDB:", err.message);
            }
            console.log(" Server shut down gracefully. Goodbye!");
            process.exit(0);
        });

        // Force exit if shutdown takes too long (10s)
        setTimeout(() => {
            console.error(" Shutdown timed out. Forcing exit...");
            process.exit(1);
        }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Cloud platform shutdown
    process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C in terminal
}

// Catch unhandled promise rejections (async errors without try/catch)
process.on("unhandledRejection", (reason) => {
    console.error(" Unhandled Promise Rejection:", reason);
});

// Catch uncaught exceptions (sync errors without try/catch) — must exit
process.on("uncaughtException", (error) => {
    console.error(" Uncaught Exception:", error.message);
    console.error("   Stack:", error.stack);
    process.exit(1);
});

startServer();
