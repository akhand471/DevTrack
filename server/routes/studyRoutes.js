const express = require('express')
const { logSession, getSessions, deleteSession, getDueReviews } = require('../controllers/studyController')
const { protect } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

const router = express.Router()

router.use(protect)

router.post('/log-session', validate(schemas.logSession), logSession)
router.get('/sessions', getSessions)
router.get('/due-reviews', getDueReviews)
router.delete('/session/:id', deleteSession)

module.exports = router
