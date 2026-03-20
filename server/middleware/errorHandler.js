const ApiError = require('../utils/ApiError')

/**
 * Centralized error handling middleware
 * Catches all errors and returns a consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err.message)
    }

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        error = new ApiError('Resource not found', 404)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        error = new ApiError(`An account with this ${field} already exists`, 400)
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message)
        error = new ApiError(messages.join(', '), 400)
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new ApiError('Invalid token', 401)
    }

    if (err.name === 'TokenExpiredError') {
        error = new ApiError('Token expired', 401)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
    })
}

module.exports = errorHandler
