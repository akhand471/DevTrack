const express = require('express')
const router = express.Router()
const {
  register, login, logout, refreshToken,
  getMe, verifyEmail, resendVerification,
  forgotPassword, resetPassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

// Public routes
router.post('/register', validate(schemas.register), register)
router.post('/login', validate(schemas.login), login)
router.post('/logout', logout)
router.post('/refresh', refreshToken)
router.get('/verify-email', verifyEmail)
router.post('/resend-verification', validate(schemas.forgotPassword), resendVerification)
router.post('/forgot-password', validate(schemas.forgotPassword), forgotPassword)
router.post('/reset-password', validate(schemas.resetPassword), resetPassword)

// Private routes
router.get('/me', protect, getMe)

module.exports = router
