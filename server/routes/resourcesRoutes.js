const express = require('express')
const { body } = require('express-validator')
const { createResource, getResources, updateResource, deleteResource } = require('../controllers/resourcesController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = express.Router()

// All resource routes are protected
router.use(protect)

/**
 * @route   POST /api/resources
 * @desc    Save a new learning resource
 */
router.post(
    '/',
    [
        body('title').trim().notEmpty().withMessage('Resource title is required'),
        body('category')
            .isIn(['DSA', 'Core CS', 'Tech Stack'])
            .withMessage('Category must be DSA, Core CS, or Tech Stack'),
        body('type')
            .isIn(['Article', 'Blog', 'Video Course', 'Course', 'GitHub', 'Book'])
            .withMessage('Invalid resource type'),
        body('url').trim().isURL().withMessage('Valid URL is required'),
        body('difficulty')
            .optional()
            .isIn(['Easy', 'Medium', 'Hard'])
            .withMessage('Difficulty must be Easy, Medium, or Hard'),
        body('notes')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters'),
    ],
    validate,
    createResource
)

/**
 * @route   GET /api/resources
 * @desc    Get all resources for the logged-in user
 */
router.get('/', getResources)

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a resource
 */
router.put('/:id', updateResource)

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource
 */
router.delete('/:id', deleteResource)

module.exports = router
