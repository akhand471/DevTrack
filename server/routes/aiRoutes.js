const express = require('express')
const { getRecommendations, getDueReviews, getAllTopics } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')
const rateLimit = require('express-rate-limit')

const router = express.Router()

// Rate-limit AI endpoint (expensive calls)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many AI requests — please wait a minute.' },
})

router.use(protect)

router.post('/recommend', aiLimiter, getRecommendations)
router.get('/due-reviews', getDueReviews)
router.get('/topics', getAllTopics)

module.exports = router
