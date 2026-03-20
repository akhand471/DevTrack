const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { protect } = require('../middleware/auth')
const { register, login, getMe, verifyEmail, resendVerification, forgotPassword, resetPassword } = require('../controllers/authController')

// POST /api/auth/register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    register
)

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
)

// GET /api/auth/verify-email?token=xxx
router.get('/verify-email', verifyEmail)

// POST /api/auth/resend-verification
router.post(
    '/resend-verification',
    [body('email').isEmail().normalizeEmail().withMessage('Provide a valid email')],
    validate,
    resendVerification
)

// GET /api/auth/me (protected)
router.get('/me', protect, getMe)

// POST /api/auth/forgot-password
router.post(
    '/forgot-password',
    [body('email').isEmail().normalizeEmail().withMessage('Provide a valid email')],
    validate,
    forgotPassword
)

// POST /api/auth/reset-password
router.post(
    '/reset-password',
    [
        body('token').notEmpty().withMessage('Reset token is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ],
    validate,
    resetPassword
)

module.exports = router
