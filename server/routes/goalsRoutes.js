const express = require('express')
const { createGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalsController')
const { protect } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

const router = express.Router()

router.use(protect)

router.post('/', validate(schemas.createGoal), createGoal)
router.get('/', getGoals)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)

module.exports = router
