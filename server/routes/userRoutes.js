const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { getProfile, updateProfile, getStats } = require('../controllers/userController')

router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/stats', getStats)

module.exports = router
