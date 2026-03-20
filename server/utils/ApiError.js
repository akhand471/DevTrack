/**
 * Custom API Error class
 * Extends Error with HTTP status code for structured error handling
 */
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true

        // Capture clean stack trace
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ApiError
