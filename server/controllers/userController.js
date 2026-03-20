const User = require('../models/User')
const ApiError = require('../utils/ApiError')

/**
 * @desc    Get the current user's full profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return next(new ApiError('User not found', 404))

        res.json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Update the current user's profile (name, githubUsername, bio, targetCompany)
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
    try {
        // Only allow safe fields to be updated (no password, no email)
        const allowedUpdates = ['name', 'githubUsername', 'bio', 'targetCompany']
        const updates = {}

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        })

        if (Object.keys(updates).length === 0) {
            return next(new ApiError('No valid fields provided to update', 400))
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        res.json({ success: true, data: user, message: 'Profile updated successfully' })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get user's streak and study stats summary
 * @route   GET /api/user/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select(
            'currentStreak longestStreak lastStudyDate createdAt'
        )

        const daysSinceJoined = Math.floor(
            (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        )

        res.json({
            success: true,
            data: {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                lastStudyDate: user.lastStudyDate,
                daysSinceJoined,
            },
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getProfile, updateProfile, getStats }
