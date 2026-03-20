const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { protect } = require('../middleware/auth')
const { getProfile, updateProfile, getStats } = require('../controllers/userController')

// All routes are protected — user must be logged in
router.use(protect)

// GET /api/user/profile
router.get('/profile', getProfile)

// PUT /api/user/profile
router.put(
    '/profile',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('bio').optional().isLength({ max: 250 }).withMessage('Bio cannot exceed 250 characters'),
    ],
    validate,
    updateProfile
)

// GET /api/user/stats
router.get('/stats', getStats)

module.exports = router
