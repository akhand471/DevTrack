const mongoose = require('mongoose')

/**
 * SpacedRepetition — per-user, per-topic SM-2 review scheduling
 * Based on the SM-2 algorithm:
 *   - easinessFactor (EF): starts at 2.5, adjusts per review quality
 *   - interval: days until next review
 *   - repetitions: consecutive correct reviews
 */
const spacedRepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['DSA', 'Core CS', 'Tech Stack', 'System Design', 'Behavioral'],
    },

    // SM-2 fields
    easinessFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },        // days
    repetitions: { type: Number, default: 0 },
    quality: { type: Number, default: 3 },          // last review quality (0–5)

    lastReviewed: { type: Date, default: null },
    nextReview: { type: Date, default: () => new Date() },

    // Accumulated stats for this topic
    totalSessions: { type: Number, default: 0 },
    totalProblems: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    avgDifficulty: { type: Number, default: 2 },    // 1=Easy, 2=Med, 3=Hard
  },
  { timestamps: true }
)

spacedRepSchema.index({ userId: 1, topic: 1 }, { unique: true })
spacedRepSchema.index({ userId: 1, nextReview: 1 })

/**
 * Apply SM-2 algorithm after a session.
 * quality: 0–5 (derived from difficulty: Easy=4, Medium=3, Hard=2)
 */
spacedRepSchema.methods.applyReview = function (quality) {
  quality = Math.max(0, Math.min(5, quality))

  // Update EF
  this.easinessFactor = Math.max(
    1.3,
    this.easinessFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  if (quality >= 3) {
    // Correct response
    if (this.repetitions === 0) this.interval = 1
    else if (this.repetitions === 1) this.interval = 6
    else this.interval = Math.round(this.interval * this.easinessFactor)
    this.repetitions += 1
  } else {
    // Incorrect — reset
    this.repetitions = 0
    this.interval = 1
  }

  this.quality = quality
  this.lastReviewed = new Date()
  this.nextReview = new Date(Date.now() + this.interval * 24 * 60 * 60 * 1000)
}

module.exports = mongoose.model('SpacedRep', spacedRepSchema)
