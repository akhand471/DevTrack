const express = require('express')
const { protect } = require('../middleware/auth')
const { getTopicPerformance, getWeeklyProgress, getSummary, getWeakAreas, getCategoryBreakdown, getRecentActivity } = require('../controllers/analyticsController')

const router = express.Router()

router.use(protect)

router.get('/topic-performance', getTopicPerformance)
router.get('/weekly-progress', getWeeklyProgress)
router.get('/summary', getSummary)
router.get('/weak-areas', getWeakAreas)
router.get('/category-breakdown', getCategoryBreakdown)
router.get('/recent-activity', getRecentActivity)

module.exports = router
