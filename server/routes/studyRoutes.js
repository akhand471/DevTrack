const express = require('express')
const { body } = require('express-validator')
const { logSession, getSessions, deleteSession } = require('../controllers/studyController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = express.Router()

// All study routes are protected
router.use(protect)

/**
 * @route   POST /api/study/log-session
 * @desc    Log a new study session
 */
router.post(
    '/log-session',
    [
        body('topic')
            .trim()
            .notEmpty()
            .withMessage('Topic is required'),
        body('category')
            .isIn(['DSA', 'Core CS', 'Tech Stack'])
            .withMessage('Category must be DSA, Core CS, or Tech Stack'),
        body('platform')
            .trim()
            .notEmpty()
            .withMessage('Platform is required'),
        body('problemsSolved')
            .isInt({ min: 0 })
            .withMessage('Problems solved must be a non-negative integer'),
        body('difficulty')
            .isIn(['Easy', 'Medium', 'Hard'])
            .withMessage('Difficulty must be Easy, Medium, or Hard'),
        body('timeSpent')
            .isInt({ min: 1 })
            .withMessage('Time spent must be at least 1 minute'),
        body('date')
            .optional()
            .isISO8601()
            .withMessage('Invalid date format'),
        body('notes')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters'),
    ],
    validate,
    logSession
)

/**
 * @route   GET /api/study/sessions
 * @desc    Get all sessions for the logged-in user (with filters)
 */
router.get('/sessions', getSessions)

/**
 * @route   DELETE /api/study/session/:id
 * @desc    Delete a study session
 */
router.delete('/session/:id', deleteSession)

module.exports = router
