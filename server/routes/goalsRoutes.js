const express = require('express')
const { body } = require('express-validator')
const { createGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalsController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = express.Router()

// All goals routes are protected
router.use(protect)

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 */
router.post(
    '/',
    [
        body('title').trim().notEmpty().withMessage('Goal title is required'),
        body('category')
            .isIn(['DSA', 'Core CS', 'Tech Stack'])
            .withMessage('Category must be DSA, Core CS, or Tech Stack'),
        body('targetProblems')
            .isInt({ min: 1 })
            .withMessage('Target must be at least 1'),
        body('deadline')
            .isISO8601()
            .withMessage('Valid deadline date is required'),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be Low, Medium, or High'),
    ],
    validate,
    createGoal
)

/**
 * @route   GET /api/goals
 * @desc    Get all goals for the logged-in user
 */
router.get('/', getGoals)

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal
 */
router.put('/:id', updateGoal)

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 */
router.delete('/:id', deleteGoal)

module.exports = router
