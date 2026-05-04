import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    console.error("Error caught in middleware:", err);
    let { statusCode, message } = err;

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Mongoose cast error (e.g. invalid ID)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }

    // Multer error
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = err.message;
    }

    if (!(err instanceof ApiError)) {
        statusCode = statusCode || 500;
        message = message || "Internal Server Error";
    }

    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

export { errorMiddleware };
