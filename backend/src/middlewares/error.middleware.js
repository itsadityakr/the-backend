// error.middleware.js — Global error handler that catches all unhandled errors

const multer = require("multer");
const { HTTP_STATUS } = require("../config/constants");

// Express identifies error handlers by having 4 params (err, req, res, next)
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(" Error:", err.message);
    console.error(" Stack:", err.stack);

    // Handle Multer file upload errors (file too large, etc.)
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "File is too large. Maximum size is 5MB.",
                error: err.code,
            });
        }
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: `File upload error: ${err.message}`,
            error: err.code,
        });
    }

    // Handle invalid file type error from upload middleware
    if (err.message === "Only image files are allowed!") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: err.message,
            error: "INVALID_FILE_TYPE",
        });
    }

    // Handle Mongoose validation errors (missing required fields, etc.)
    if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Validation failed. Please check your input data.",
            error: err.message,
        });
    }

    // Handle all other unknown errors
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong on the server.",
        // Include stack trace only in development mode
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = globalErrorHandler;
