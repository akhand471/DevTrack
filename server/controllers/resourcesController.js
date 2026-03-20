const Resource = require('../models/Resource')
const ApiError = require('../utils/ApiError')

/**
 * @desc    Create a new resource
 * @route   POST /api/resources
 * @access  Private
 */
const createResource = async (req, res, next) => {
    try {
        const { title, category, type, difficulty, url, notes } = req.body

        const resource = await Resource.create({
            userId: req.user._id,
            title,
            category,
            type,
            difficulty: difficulty || 'Medium',
            url,
            notes: notes || '',
        })

        res.status(201).json({
            success: true,
            data: resource,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get all resources for logged-in user
 * @route   GET /api/resources
 * @access  Private
 *
 * Query params:
 *   - category: DSA | Core CS | Tech Stack
 *   - type: Article | Blog | Video Course | Course | GitHub | Book
 *   - favorites: true (only favorites)
 */
const getResources = async (req, res, next) => {
    try {
        const { category, type, favorites } = req.query

        const filter = { userId: req.user._id }
        if (category) filter.category = category
        if (type) filter.type = type
        if (favorites === 'true') filter.isFavorite = true

        const resources = await Resource.find(filter).sort('-createdAt').lean()

        res.json({
            success: true,
            count: resources.length,
            data: resources,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Update a resource (favorite toggle, rating, notes, etc.)
 * @route   PUT /api/resources/:id
 * @access  Private
 */
const updateResource = async (req, res, next) => {
    try {
        let resource = await Resource.findById(req.params.id)

        if (!resource) return next(new ApiError('Resource not found', 404))

        if (resource.userId.toString() !== req.user._id.toString()) {
            return next(new ApiError('Not authorized to update this resource', 403))
        }

        const allowedUpdates = ['title', 'category', 'type', 'difficulty', 'url', 'notes', 'isFavorite', 'rating']
        const updates = {}

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        })

        resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        res.json({
            success: true,
            data: resource,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private
 */
const deleteResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id)

        if (!resource) return next(new ApiError('Resource not found', 404))

        if (resource.userId.toString() !== req.user._id.toString()) {
            return next(new ApiError('Not authorized to delete this resource', 403))
        }

        await Resource.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: 'Resource deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { createResource, getResources, updateResource, deleteResource }
