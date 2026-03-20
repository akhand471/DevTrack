const StudySession = require('../models/StudySession')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

/**
 * @desc    Log a new study session and update user's study streak
 * @route   POST /api/study/log-session
 * @access  Private
 */
const logSession = async (req, res, next) => {
    try {
        const { topic, category, platform, problemsSolved, difficulty, timeSpent, date, notes } = req.body

        const session = await StudySession.create({
            userId: req.user._id,
            topic,
            category,
            platform,
            problemsSolved,
            difficulty,
            timeSpent,
            date: date || Date.now(),
            notes: notes || '',
        })

        // Update user's study streak after logging a session
        const user = await User.findById(req.user._id)
        if (user) {
            user.updateStreak()
            await user.save({ validateBeforeSave: false })
        }

        res.status(201).json({
            success: true,
            data: session,
            streak: {
                currentStreak: user?.currentStreak || 0,
                longestStreak: user?.longestStreak || 0,
            },
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get all study sessions for the logged-in user
 * @route   GET /api/study/sessions
 * @access  Private
 *
 * Query params:
 *   - category: Filter by category (DSA, Core CS, Tech Stack)
 *   - difficulty: Filter by difficulty (Easy, Medium, Hard)
 *   - topic: Filter by topic name
 *   - startDate: Filter sessions from this date
 *   - endDate: Filter sessions until this date
 *   - page: Page number (default: 1)
 *   - limit: Results per page (default: 20)
 *   - sort: Sort field (default: -date, newest first)
 */
const getSessions = async (req, res, next) => {
    try {
        const {
            category,
            difficulty,
            topic,
            startDate,
            endDate,
            page = 1,
            limit = 20,
            sort = '-date',
        } = req.query

        // Build filter object
        const filter = { userId: req.user._id }

        if (category) filter.category = category
        if (difficulty) filter.difficulty = difficulty
        if (topic) filter.topic = { $regex: topic, $options: 'i' }

        if (startDate || endDate) {
            filter.date = {}
            if (startDate) filter.date.$gte = new Date(startDate)
            if (endDate) filter.date.$lte = new Date(endDate)
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [sessions, total] = await Promise.all([
            StudySession.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            StudySession.countDocuments(filter),
        ])

        res.json({
            success: true,
            count: sessions.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: sessions,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Delete a study session
 * @route   DELETE /api/study/session/:id
 * @access  Private
 */
const deleteSession = async (req, res, next) => {
    try {
        const session = await StudySession.findById(req.params.id)

        if (!session) {
            return next(new ApiError('Study session not found', 404))
        }

        // Ensure user owns this session
        if (session.userId.toString() !== req.user._id.toString()) {
            return next(new ApiError('Not authorized to delete this session', 403))
        }

        await StudySession.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: 'Session deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { logSession, getSessions, deleteSession }
