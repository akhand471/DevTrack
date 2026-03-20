const mongoose = require('mongoose')

/**
 * Goal Schema
 * Tracks learning goals set by a user
 */
const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Goal title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['DSA', 'Core CS', 'Tech Stack'],
        },
        targetProblems: {
            type: Number,
            required: [true, 'Target number is required'],
            min: [1, 'Target must be at least 1'],
        },
        currentProblems: {
            type: Number,
            default: 0,
            min: [0, 'Cannot be negative'],
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Goal', goalSchema)
