import { NODE_ENV } from "../config/env.js";
import AppError from "../utils/AppError.js";

// --- Specific Third-Party Error Handlers ---

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue ? err.keyValue[field] : "";
    const message = `Duplicate value for '${field}': '${value}'. Please use another value.`;
    return new AppError(message, 409);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
    new AppError("Your session has expired. Please log in again.", 401);

// --- Response Senders ---

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    console.error("ERROR 💥:", err);
    return res.status(500).json({
        status: "error",
        message: "Something went wrong. Please try again later.",
    });
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (NODE_ENV === "development") {
        return sendErrorDev(err, res);
    }

    let error = { ...err, name: err.name, message: err.message };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    return sendErrorProd(error, res);
};

export default errorHandler;