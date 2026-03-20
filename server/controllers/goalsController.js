const Goal = require('../models/Goal')
const ApiError = require('../utils/ApiError')

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res, next) => {
    try {
        const { title, category, targetProblems, deadline, priority } = req.body

        const goal = await Goal.create({
            userId: req.user._id,
            title,
            category,
            targetProblems,
            deadline,
            priority: priority || 'Medium',
        })

        res.status(201).json({
            success: true,
            data: goal,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get all goals for logged-in user
 * @route   GET /api/goals
 * @access  Private
 *
 * Query params:
 *   - status: Not Started | In Progress | Completed
 *   - category: DSA | Core CS | Tech Stack
 *   - sort: default -createdAt
 */
const getGoals = async (req, res, next) => {
    try {
        const { status, category, sort = '-createdAt' } = req.query

        const filter = { userId: req.user._id }
        if (status) filter.status = status
        if (category) filter.category = category

        const goals = await Goal.find(filter).sort(sort).lean()

        res.json({
            success: true,
            count: goals.length,
            data: goals,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Update a goal (progress, status, title, etc.)
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res, next) => {
    try {
        let goal = await Goal.findById(req.params.id)

        if (!goal) return next(new ApiError('Goal not found', 404))

        if (goal.userId.toString() !== req.user._id.toString()) {
            return next(new ApiError('Not authorized to update this goal', 403))
        }

        // Allow updating specific fields
        const allowedUpdates = ['title', 'category', 'targetProblems', 'currentProblems', 'deadline', 'priority', 'status']
        const updates = {}

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        })

        // Auto-complete if currentProblems reaches target
        if (updates.currentProblems !== undefined && goal.targetProblems) {
            if (updates.currentProblems >= (updates.targetProblems || goal.targetProblems)) {
                updates.status = 'Completed'
            } else if (updates.currentProblems > 0 && updates.status !== 'Completed') {
                updates.status = 'In Progress'
            }
        }

        goal = await Goal.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        res.json({
            success: true,
            data: goal,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id)

        if (!goal) return next(new ApiError('Goal not found', 404))

        if (goal.userId.toString() !== req.user._id.toString()) {
            return next(new ApiError('Not authorized to delete this goal', 403))
        }

        await Goal.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: 'Goal deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { createGoal, getGoals, updateGoal, deleteGoal }
