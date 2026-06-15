const StudySession = require('../models/StudySession')
const SpacedRep = require('../models/SpacedRep')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const logger = require('../utils/logger')

/** Map difficulty → SM-2 quality score */
const difficultyToQuality = { Easy: 4, Medium: 3, Hard: 2 }

/**
 * @desc    Log a new study session and update streak + spaced repetition
 * @route   POST /api/study/log-session
 * @access  Private
 */
const logSession = async (req, res, next) => {
  try {
    const { topic, category, platform, problemsSolved, difficulty, timeSpent, date, notes } = req.body

    // 1. Create session
    const session = await StudySession.create({
      userId: req.user._id,
      topic, category, platform,
      problemsSolved, difficulty,
      timeSpent, notes: notes || '',
      date: date ? new Date(date) : Date.now(),
    })

    // 2. Update streak
    const user = await User.findById(req.user._id)
    if (user) {
      user.updateStreak()
      await user.save({ validateBeforeSave: false })
    }

    // 3. Upsert spaced repetition record for this topic
    const quality = difficultyToQuality[difficulty] ?? 3
    let sr = await SpacedRep.findOne({ userId: req.user._id, topic })
    if (!sr) {
      sr = new SpacedRep({ userId: req.user._id, topic, category })
    }
    sr.applyReview(quality)
    sr.totalSessions += 1
    sr.totalProblems += problemsSolved || 0
    sr.totalMinutes += timeSpent || 0
    // Running average difficulty (1=Easy, 2=Med, 3=Hard)
    const diffNum = { Easy: 1, Medium: 2, Hard: 3 }[difficulty] || 2
    sr.avgDifficulty = ((sr.avgDifficulty * (sr.totalSessions - 1)) + diffNum) / sr.totalSessions
    await sr.save()

    logger.info(`Session logged: ${topic} (${category}) for user ${req.user._id}`)

    res.status(201).json({
      success: true,
      data: session,
      streak: {
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
      },
      nextReview: {
        topic,
        nextReview: sr.nextReview,
        intervalDays: sr.interval,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all study sessions for the logged-in user
 * @route   GET /api/study/sessions
 * @access  Private
 */
const getSessions = async (req, res, next) => {
  try {
    const { category, difficulty, topic, startDate, endDate, page = 1, limit = 20, sort = '-date' } = req.query

    const filter = { userId: req.user._id }
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    if (topic) filter.topic = { $regex: topic, $options: 'i' }
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [sessions, total] = await Promise.all([
      StudySession.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      StudySession.countDocuments(filter),
    ])

    res.json({
      success: true,
      count: sessions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: sessions,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete a study session
 * @route   DELETE /api/study/session/:id
 * @access  Private
 */
const deleteSession = async (req, res, next) => {
  try {
    const session = await StudySession.findById(req.params.id)
    if (!session) return next(new ApiError('Study session not found', 404))
    if (session.userId.toString() !== req.user._id.toString()) {
      return next(new ApiError('Not authorized to delete this session', 403))
    }
    await StudySession.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Session deleted successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get topics due for spaced-repetition review
 * @route   GET /api/study/due-reviews
 * @access  Private
 */
const getDueReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const now = new Date()

    const dueTopics = await SpacedRep.find({
      userId: req.user._id,
      nextReview: { $lte: now },
    })
      .sort({ nextReview: 1 })
      .limit(limit)
      .lean()

    res.json({
      success: true,
      count: dueTopics.length,
      data: dueTopics.map((t) => ({
        topic: t.topic,
        category: t.category,
        daysOverdue: Math.floor((now - new Date(t.nextReview)) / 86400000),
        totalSessions: t.totalSessions,
        avgDifficulty: Math.round(t.avgDifficulty * 10) / 10,
        easinessFactor: Math.round(t.easinessFactor * 100) / 100,
        lastReviewed: t.lastReviewed,
      })),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { logSession, getSessions, deleteSession, getDueReviews }
