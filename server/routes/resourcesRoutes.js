const express = require('express')
const { createResource, getResources, updateResource, deleteResource } = require('../controllers/resourcesController')
const { protect } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

const router = express.Router()

router.use(protect)

router.post('/', validate(schemas.createResource), createResource)
router.get('/', getResources)
router.put('/:id', updateResource)
router.delete('/:id', deleteResource)

module.exports = router
