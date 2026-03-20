const mongoose = require('mongoose')

/**
 * Resource Schema
 * Stores curated learning resources saved by a user
 */
const resourceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Resource title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['DSA', 'Core CS', 'Tech Stack'],
        },
        type: {
            type: String,
            required: [true, 'Resource type is required'],
            enum: ['Article', 'Blog', 'Video Course', 'Course', 'GitHub', 'Book'],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium',
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
            default: '',
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for efficient queries
resourceSchema.index({ userId: 1, category: 1 })

module.exports = mongoose.model('Resource', resourceSchema)
