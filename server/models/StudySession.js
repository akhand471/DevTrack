const mongoose = require('mongoose')

/**
 * StudySession Schema
 * Tracks each coding practice session logged by a user
 */
const studySessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        topic: {
            type: String,
            required: [true, 'Topic is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['DSA', 'Core CS', 'Tech Stack'],
                message: '{VALUE} is not a valid category',
            },
        },
        platform: {
            type: String,
            required: [true, 'Platform is required'],
            trim: true,
        },
        problemsSolved: {
            type: Number,
            required: [true, 'Number of problems solved is required'],
            min: [0, 'Cannot be negative'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty is required'],
            enum: {
                values: ['Easy', 'Medium', 'Hard'],
                message: '{VALUE} is not a valid difficulty',
            },
        },
        timeSpent: {
            type: Number,
            required: [true, 'Time spent is required'],
            min: [1, 'Time must be at least 1 minute'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for efficient queries by user and date
studySessionSchema.index({ userId: 1, date: -1 })

// Compound index for analytics aggregation
studySessionSchema.index({ userId: 1, topic: 1 })

module.exports = mongoose.model('StudySession', studySessionSchema)
