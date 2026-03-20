const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

/**
 * Protect routes — verify JWT token from Authorization header
 * Attaches user object to req.user for downstream handlers
 */
const protect = async (req, res, next) => {
    let token

    // Check for Bearer token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ApiError('Not authorized — no token provided', 401))
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach user to request (exclude password)
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
            return next(new ApiError('Not authorized — user not found', 401))
        }

        next()
    } catch (error) {
        return next(new ApiError('Not authorized — invalid token', 401))
    }
}

module.exports = { protect }
