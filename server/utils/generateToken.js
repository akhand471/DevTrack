const jwt = require('jsonwebtoken')

/**
 * Generate a short-lived access token (15 min)
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  })
}

/**
 * Generate a long-lived refresh token (7 days)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  })
}

/**
 * Set refresh token in an httpOnly cookie
 */
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  })
}

/**
 * Clear the refresh token cookie
 */
const clearRefreshCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  })
}

// Legacy export for backward compatibility
const generateToken = (userId) => generateAccessToken(userId)

module.exports = generateToken
module.exports.generateAccessToken = generateAccessToken
module.exports.generateRefreshToken = generateRefreshToken
module.exports.setRefreshCookie = setRefreshCookie
module.exports.clearRefreshCookie = clearRefreshCookie
