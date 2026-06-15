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
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['DSA', 'Core CS', 'Tech Stack', 'System Design', 'Behavioral'],
        message: '{VALUE} is not a valid category',
      },
    },
    platform: {
      type: String,
      trim: true,
      default: '',
    },
    problemsSolved: {
      type: Number,
      default: 0,
      min: [0, 'Cannot be negative'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty',
      },
      default: 'Medium',
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, 'Time cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
  },
  { timestamps: true }
)

// Compound indexes for efficient queries
studySessionSchema.index({ userId: 1, date: -1 })
studySessionSchema.index({ userId: 1, topic: 1 })
studySessionSchema.index({ userId: 1, category: 1 })

module.exports = mongoose.model('StudySession', studySessionSchema)
