const express = require('express')
const { getTopicPerformance, getWeeklyProgress } = require('../controllers/analyticsController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All analytics routes are protected
router.use(protect)

/**
 * @route   GET /api/analytics/topic-performance
 * @desc    Get aggregated stats per topic (with optional category filter)
 */
router.get('/topic-performance', getTopicPerformance)

/**
 * @route   GET /api/analytics/weekly-progress
 * @desc    Get weekly progress for the last N weeks
 */
router.get('/weekly-progress', getWeeklyProgress)

module.exports = router
